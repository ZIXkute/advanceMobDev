import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Image, StyleSheet, View } from "react-native";

import HomeScreen from "./index";
import PlaylistScreen from "./playlist";
import PlaylistAppScreen from "./playlistApp";
import ProfileScreen from "./profile";
import SettingsScreen from "./settings";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      {/* Profile Picture */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/images/clarke.webp")}
          style={styles.profileImage}
        />
      </View>

      {/* Default drawer items */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function HomeLayout() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#121212" },
        headerTintColor: "#fff",
        drawerStyle: { backgroundColor: "#1c1c1c" },
        drawerActiveTintColor: "#1DB954",
        drawerInactiveTintColor: "#fff",

        // ✅ Swipe gestures
        swipeEnabled: true,
        swipeEdgeWidth: 9999, // Full screen swipe
        drawerType: "front",  // Drawer slides over screen
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="My Music" component={PlaylistScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Playlist (Reducer)" component={PlaylistAppScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
