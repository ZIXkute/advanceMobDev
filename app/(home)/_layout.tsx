import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Image, View, StyleSheet } from "react-native";

import HomeScreen from "./index";
import ProfileScreen from "./profile";
import PlaylistScreen from "./playlist";
import SettingsScreen from "./settings";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      {/* Profile Picture */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/images/ken.jpeg")}
          style={styles.profileImage}
        />
      </View>

      {/* Default items (now includes Playlist & Settings too) */}
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
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Playlist" component={PlaylistScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
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
