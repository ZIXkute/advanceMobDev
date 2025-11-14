import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SettingsScreen() {
  const router = useRouter();
  const { currentTheme } = useAppSelector((state) => state.theme);

  const settingsItems = [
    {
      id: 'theme',
      title: 'Theme Settings',
      icon: 'color-palette',
      route: '/theme-settings',
    },
    {
      id: 'camera',
      title: 'Camera',
      icon: 'camera',
      route: '/camera',
    },
    {
      id: 'map',
      title: 'Map & Location',
      icon: 'map',
      route: '/map',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>⚙️ Settings</Text>
      </View>

      <View style={styles.section}>
        {settingsItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.settingItem, { backgroundColor: currentTheme.colors.surface }]}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.settingItemLeft}>
              <Ionicons
                name={item.icon as any}
                size={24}
                color={currentTheme.colors.accent}
              />
              <Text style={[styles.settingItemText, { color: currentTheme.colors.text }]}>
                {item.title}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={currentTheme.colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  section: {
    padding: 20,
    gap: 15,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  settingItemText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
