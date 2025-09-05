import { View, Text, StyleSheet, Image, FlatList } from 'react-native';

const songs = [
  { id: '1', title: 'Prinsipal', image: require('@/assets/images/ken.jpeg') },
  { id: '2', title: 'Summoning Eru', image: require('@/assets/images/sum.jpg') },
  { id: '3', title: 'Englisera', image: require('@/assets/images/miss.jpeg') },
  { id: '4', title: 'SiLuoie', image: require('@/assets/images/luwi.jpeg') },
];

export default function Playlist() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Playlist</Text>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.songItem}>
            <Image source={item.image} style={styles.songImage} />
            <Text style={styles.songTitle}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1DB954', marginBottom: 20, textAlign: 'center' },
  songItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  songImage: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
  songTitle: { color: 'white', fontSize: 16 },
});
