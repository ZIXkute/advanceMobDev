// app/(home)/index.tsx
import React from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

const recentlyPlayed = [
  { id: "1", title: "Top Hits", image: require("@/assets/images/chx.png") },
  { id: "2", title: "Chill Vibes", image: require("@/assets/images/check.jpeg") },
];

const madeForYou = [
  { id: "3", title: "Rock Mix", image: require("@/assets/images/vdr.jpeg") },
  { id: "4", title: "Classics", image: require("@/assets/images/Classics.jpg") },
];

const playlists = [
  { id: "5", title: "Top Hits 2025", image: require("@/assets/images/clrk.png") },
  { id: "6", title: "Chill Vibes", image: require("@/assets/images/clarke.webp") },
  { id: "7", title: "Workout Mix", image: require("@/assets/images/vdr.jpeg") },
];

interface PlaylistItem {
  id: string;
  title: string;
  image: any;
}

export default function HomeScreen() {
  const renderSquareItem = ({ item }: { item: PlaylistItem }) => (
    <TouchableOpacity style={styles.squareCard}>
      <Image source={item.image} style={styles.squareImage} />
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderRowItem = ({ item }: { item: PlaylistItem }) => (
    <TouchableOpacity style={styles.rowCard}>
      <Image source={item.image} style={styles.rowImage} />
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Greeting */}
      <Text style={styles.greeting}>Good Afternoon 👋</Text>

      {/* Recently Played */}
      <Text style={styles.sectionTitle}>Recently Played</Text>
      <FlatList
        data={recentlyPlayed}
        renderItem={renderSquareItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Made For You */}
      <Text style={styles.sectionTitle}>Made For You</Text>
      <FlatList
        data={madeForYou}
        renderItem={renderSquareItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Your Playlists */}
      <Text style={styles.sectionTitle}>Your Playlists</Text>
      <FlatList
        data={playlists}
        renderItem={renderRowItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 15 },
  greeting: { fontSize: 22, fontWeight: "bold", color: "white", marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "white", marginVertical: 10 },

  listContainer: { paddingBottom: 10 },

  squareCard: {
    marginRight: 15,
    alignItems: "center",
    width: 140,
  },
  squareImage: {
    width: 140,
    height: 140,
    borderRadius: 10,
    marginBottom: 5,
  },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 8,
  },
  rowImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },
  cardText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
