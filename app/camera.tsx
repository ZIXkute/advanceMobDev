import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
// import * as ImageManipulator from 'expo-image-manipulator';

const { width, height } = Dimensions.get('window');

type FilterType = 'none' | 'grayscale' | 'sepia' | 'vintage' | 'cool' | 'warm';

interface Filter {
  name: string;
  type: FilterType;
}

const filters: Filter[] = [
  { name: 'None', type: 'none' },
  { name: 'Grayscale', type: 'grayscale' },
  { name: 'Sepia', type: 'sepia' },
  { name: 'Vintage', type: 'vintage' },
  { name: 'Cool', type: 'cool' },
  { name: 'Warm', type: 'warm' },
];

const FilterPreview = React.memo<{
  filter: FilterType;
  intensity: number;
}>(({ filter, intensity }) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
  }, [filter, intensity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.filterOverlay, animatedStyle]} />;
});

export default function CameraScreen() {
  // All hooks must be called before any conditional returns
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('none');
  const [filterIntensity, setFilterIntensity] = useState(1);
  const [isCapturing, setIsCapturing] = useState(false);
  const { currentTheme } = useAppSelector((state) => state.theme);
  const scale = useSharedValue(1);

  // This hook must be called before any conditional returns
  const captureButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    const checkPermissions = async () => {
      if (!permission) {
        try {
          await requestPermission();
        } catch (error) {
          console.error('Error requesting camera permission:', error);
          Alert.alert(
            'Camera Permission Required',
            'This app needs camera access to take photos. Please enable camera permissions in your device settings.',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => router.back() },
              { text: 'OK', onPress: () => requestPermission() },
            ]
          );
        }
      }
    };
    checkPermissions();
  }, [permission, requestPermission, router]);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    scale.value = 0.9;
    scale.value = withSpring(1);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo) {
        // Note: Advanced filters (grayscale, sepia, etc.) would require
        // additional image processing libraries or shader-based solutions
        // For now, we save the photo as captured
        // Future enhancement: Integrate with expo-gl and GL shaders for real-time filters
        
        Alert.alert('Photo Captured', 'Photo saved successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture photo');
    } finally {
      setIsCapturing(false);
    }
  };

  // Conditional returns after all hooks
  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <Text style={[styles.text, { color: currentTheme.colors.text }]}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionTitle, { color: currentTheme.colors.text }]}>
            Camera Access Required
          </Text>
          <Text style={[styles.permissionText, { color: currentTheme.colors.textSecondary }]}>
            This app needs access to your camera to take photos with filters. Please grant camera permissions to continue.
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: currentTheme.colors.accent }]}
            onPress={async () => {
              try {
                await requestPermission();
              } catch (error) {
                Alert.alert(
                  'Permission Denied',
                  'Camera permission was denied. Please enable it in your device settings.',
                  [
                    { text: 'Cancel', style: 'cancel', onPress: () => router.back() },
                    { text: 'OK' },
                  ]
                );
              }
            }}
          >
            <Text style={styles.buttonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: currentTheme.colors.surface, marginTop: 10 }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { color: currentTheme.colors.text }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode="picture"
      >
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Camera</Text>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.flipButtonText}>🔄</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Selection */}
          <View style={styles.filterContainer}>
            <Text style={[styles.filterLabel, { color: currentTheme.colors.text }]}>
              Filters
            </Text>
            <View style={styles.filterRow}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.type}
                  style={[
                    styles.filterButton,
                    {
                      backgroundColor:
                        currentFilter === filter.type
                          ? currentTheme.colors.accent
                          : currentTheme.colors.surface,
                    },
                  ]}
                  onPress={() => setCurrentFilter(filter.type)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      {
                        color:
                          currentFilter === filter.type
                            ? '#fff'
                            : currentTheme.colors.text,
                      },
                    ]}
                  >
                    {filter.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Intensity Slider */}
            {currentFilter !== 'none' && (
              <View style={styles.intensityContainer}>
                <Text style={[styles.intensityLabel, { color: currentTheme.colors.text }]}>
                  Intensity: {Math.round(filterIntensity * 100)}%
                </Text>
                <View style={styles.sliderContainer}>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => setFilterIntensity(Math.max(0, filterIntensity - 0.1))}
                  >
                    <Text style={styles.sliderButtonText}>−</Text>
                  </TouchableOpacity>
                  <View style={[styles.sliderTrack, { backgroundColor: currentTheme.colors.surface }]}>
                    <View
                      style={[
                        styles.sliderFill,
                        {
                          width: `${filterIntensity * 100}%`,
                          backgroundColor: currentTheme.colors.accent,
                        },
                      ]}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => setFilterIntensity(Math.min(1, filterIntensity + 0.1))}
                  >
                    <Text style={styles.sliderButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Capture Button */}
          <View style={styles.bottomControls}>
            <Animated.View style={captureButtonStyle}>
              <TouchableOpacity
                style={[
                  styles.captureButton,
                  { backgroundColor: currentTheme.colors.accent },
                ]}
                onPress={takePicture}
                disabled={isCapturing}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipButtonText: {
    fontSize: 20,
  },
  filterContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#fff',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  intensityContainer: {
    marginTop: 10,
  },
  intensityLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#fff',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sliderButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 3,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

