import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface PointOfInterest {
  id: string;
  title: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  radius: number; // Geofence radius in meters
}

const initialPOIs: PointOfInterest[] = [
  {
    id: '1',
    title: 'Central Park',
    description: 'A beautiful park in the city center',
    coordinate: {
      latitude: 40.7829,
      longitude: -73.9654,
    },
    radius: 500,
  },
  {
    id: '2',
    title: 'Tech Hub',
    description: 'Technology innovation center',
    coordinate: {
      latitude: 40.7589,
      longitude: -73.9851,
    },
    radius: 300,
  },
  {
    id: '3',
    title: 'Shopping District',
    description: 'Popular shopping area',
    coordinate: {
      latitude: 40.7505,
      longitude: -73.9934,
    },
    radius: 400,
  },
];

type MapStyle = 'standard' | 'satellite' | 'terrain' | 'hybrid';

// Google Maps style - standard road map style (matching Google Maps appearance)
const googleMapsStandardStyle = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#e9e9e9' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#dadada' }],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [{ color: '#e4e4e4' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#fefefe' }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#dedede' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'simplified' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#f2f2f2' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [{ color: '#eeeeee' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#b9b9b9' }, { weight: 0.5 }],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#dcdcdc' }],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#737373' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#737373' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#525252' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#525252' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#737373' }],
  },
];

const mapStyles: Record<MapStyle, any> = {
  standard: googleMapsStandardStyle,
  satellite: [], // Will use mapType="satellite"
  terrain: [], // Will use mapType="terrain"
  hybrid: [], // Will use mapType="hybrid"
};

// Default location (New York City) - used as fallback
const DEFAULT_LOCATION = {
  latitude: 40.7589,
  longitude: -73.9851,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const { currentTheme } = useAppSelector((state) => state.theme);
  // Initialize with default location so map shows immediately
  const [location, setLocation] = useState<Location.LocationObject | null>({
    coords: {
      latitude: DEFAULT_LOCATION.latitude,
      longitude: DEFAULT_LOCATION.longitude,
      altitude: null,
      accuracy: 100,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>('standard');
  const [pois] = useState<PointOfInterest[]>(initialPOIs);
  const [geofenceStatus, setGeofenceStatus] = useState<Record<string, boolean>>({});
  const [watchSubscription, setWatchSubscription] = useState<Location.LocationSubscription | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const scale = useSharedValue(1);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoadingLocation(true);
        
        // Check if location services are enabled
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          if (isMounted) {
            setErrorMsg('Location services are disabled. Showing default location. Enable location services for accurate positioning.');
            setIsLoadingLocation(false);
          }
          return;
        }

        // Request permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) {
            setErrorMsg('Location permission denied. Showing default location. Enable location permissions for accurate positioning.');
            setIsLoadingLocation(false);
          }
          return;
        }

        // Get current location with error handling
        try {
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeout: 10000,
          });
          
          if (isMounted) {
            setLocation(currentLocation);
            setErrorMsg(null);
            setIsLoadingLocation(false);
            
            // Animate map to user location
            if (mapRef.current) {
              mapRef.current.animateToRegion(
                {
                  latitude: currentLocation.coords.latitude,
                  longitude: currentLocation.coords.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                },
                1000
              );
            }
          }
        } catch (locationError: any) {
          console.error('Error getting location:', locationError);
          if (isMounted) {
            setErrorMsg('Using default location. Enable location services for accurate positioning.');
            setIsLoadingLocation(false);
          }
        }

        // Watch position for geofencing with error handling
        try {
          const subscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Balanced,
              timeInterval: 5000,
              distanceInterval: 10,
            },
            (newLocation) => {
              if (isMounted) {
                setLocation(newLocation);
                checkGeofences(newLocation);
                
                // Update map region when location changes
                if (mapRef.current) {
                  mapRef.current.animateToRegion(
                    {
                      latitude: newLocation.coords.latitude,
                      longitude: newLocation.coords.longitude,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    },
                    500
                  );
                }
              }
            }
          );

          if (isMounted) {
            setWatchSubscription(subscription);
          }
        } catch (watchError) {
          console.error('Error watching position:', watchError);
          // Continue without watching if it fails
        }
      } catch (error: any) {
        console.error('Location setup error:', error);
        if (isMounted) {
          setErrorMsg('Using default location. Enable location services for accurate positioning.');
          setIsLoadingLocation(false);
        }
      }
    })();

    return () => {
      isMounted = false;
      if (watchSubscription) {
        watchSubscription.remove();
      }
    };
  }, []);

  const checkGeofences = (currentLocation: Location.LocationObject) => {
    const newStatus: Record<string, boolean> = {};

    pois.forEach((poi) => {
      const distance = calculateDistance(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        poi.coordinate.latitude,
        poi.coordinate.longitude
      );

      const isInside = distance <= poi.radius;
      const wasInside = geofenceStatus[poi.id];

      if (isInside && !wasInside) {
        Alert.alert('Geofence Entered', `You entered ${poi.title}!`);
      } else if (!isInside && wasInside) {
        Alert.alert('Geofence Exited', `You left ${poi.title}!`);
      }

      newStatus[poi.id] = isInside;
    });

    setGeofenceStatus(newStatus);
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const centerOnLocation = () => {
    if (location && mapRef.current) {
      scale.value = 0.95;
      scale.value = withSpring(1);

      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Always show map, even if location is not available (uses default location)
  if (!location) {
    return (
      <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <Text style={[styles.text, { color: currentTheme.colors.text }]}>
          Initializing map...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: DEFAULT_LOCATION.latitudeDelta,
          longitudeDelta: DEFAULT_LOCATION.longitudeDelta,
        }}
        customMapStyle={mapStyle === 'standard' ? mapStyles[mapStyle] : undefined}
        mapType={mapStyle === 'satellite' ? 'satellite' : mapStyle === 'terrain' ? 'terrain' : mapStyle === 'hybrid' ? 'hybrid' : 'standard'}
        showsUserLocation={!isLoadingLocation && !errorMsg}
        showsMyLocationButton={true}
        showsCompass={true}
        toolbarEnabled={false}
        loadingEnabled={true}
        loadingIndicatorColor={currentTheme.colors.accent}
        loadingBackgroundColor={currentTheme.colors.surface}
        onMapReady={() => {
          console.log('Map is ready');
        }}
        onError={(error) => {
          console.error('Map error:', error);
        }}
      >
        {/* User Location is shown via showsUserLocation prop */}

        {/* Points of Interest */}
        {pois.map((poi) => (
          <React.Fragment key={poi.id}>
            <Marker
              coordinate={poi.coordinate}
              title={poi.title}
              description={poi.description}
              pinColor={geofenceStatus[poi.id] ? '#34c759' : '#ff3b30'}
            />
            <Circle
              center={poi.coordinate}
              radius={poi.radius}
              strokeColor={geofenceStatus[poi.id] ? '#34c759' : '#ff3b30'}
              fillColor={
                geofenceStatus[poi.id]
                  ? 'rgba(52, 199, 89, 0.2)'
                  : 'rgba(255, 59, 48, 0.2)'
              }
              strokeWidth={2}
            />
          </React.Fragment>
        ))}
      </MapView>

      {/* Controls Overlay */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: currentTheme.colors.surface }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backText, { color: currentTheme.colors.accent }]}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>Map</Text>
            {errorMsg && (
              <Text style={[styles.headerSubtitle, { color: currentTheme.colors.textSecondary }]}>
                {isLoadingLocation ? 'Loading...' : 'Default location'}
              </Text>
            )}
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Map Style Selector */}
        <View style={[styles.controls, { backgroundColor: currentTheme.colors.surface }]}>
          <Text style={[styles.controlsTitle, { color: currentTheme.colors.text }]}>
            Map Style
          </Text>
          <View style={styles.styleButtons}>
            {(['standard', 'satellite', 'terrain', 'hybrid'] as MapStyle[]).map((style) => (
              <TouchableOpacity
                key={style}
                style={[
                  styles.styleButton,
                  {
                    backgroundColor:
                      mapStyle === style
                        ? currentTheme.colors.accent
                        : currentTheme.colors.background,
                  },
                ]}
                onPress={() => setMapStyle(style)}
              >
                <Text
                  style={[
                    styles.styleButtonText,
                    {
                      color:
                        mapStyle === style ? '#fff' : currentTheme.colors.text,
                    },
                  ]}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: currentTheme.colors.accent },
              ]}
              onPress={centerOnLocation}
            >
              <Text style={styles.actionButtonText}>📍</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* POI List */}
        <View style={[styles.poiList, { backgroundColor: currentTheme.colors.surface }]}>
          <Text style={[styles.poiListTitle, { color: currentTheme.colors.text }]}>
            Points of Interest
          </Text>
          {pois.map((poi) => (
            <TouchableOpacity
              key={poi.id}
              style={styles.poiItem}
              onPress={() => {
                mapRef.current?.animateToRegion(
                  {
                    latitude: poi.coordinate.latitude,
                    longitude: poi.coordinate.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  },
                  1000
                );
              }}
            >
              <View
                style={[
                  styles.poiIndicator,
                  {
                    backgroundColor: geofenceStatus[poi.id]
                      ? '#34c759'
                      : '#ff3b30',
                  },
                ]}
              />
              <View style={styles.poiInfo}>
                <Text style={[styles.poiTitle, { color: currentTheme.colors.text }]}>
                  {poi.title}
                </Text>
                <Text
                  style={[styles.poiDescription, { color: currentTheme.colors.textSecondary }]}
                >
                  {poi.description}
                </Text>
                <Text
                  style={[styles.poiStatus, { color: currentTheme.colors.textSecondary }]}
                >
                  {geofenceStatus[poi.id] ? 'Inside' : 'Outside'} (Radius: {poi.radius}m)
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    marginRight: 15,
  },
  backText: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },
  headerSpacer: {
    width: 60,
  },
  controls: {
    padding: 15,
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  styleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  styleButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  styleButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 200,
    right: 15,
    alignItems: 'flex-end',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    fontSize: 24,
  },
  poiList: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: 200,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  poiListTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  poiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  poiIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  poiInfo: {
    flex: 1,
  },
  poiTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  poiDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  poiStatus: {
    fontSize: 10,
    marginTop: 2,
  },
  text: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

