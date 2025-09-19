import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const songs = [
  {
    id: '1',
    title: 'Prinsipal',
    image: require('@/assets/images/ken.jpeg'),
    videoId: 'juZz0baHF1U', // <-- paste YouTube VIDEO ID only (after ?v=)
  },
  {
    id: '2',
    title: 'Summoning Eru',
    image: require('@/assets/images/sum.jpg'),
    videoId: '3AT5SnKVD3M',
  },
  {
    id: '3',
    title: 'Englisera',
    image: require('@/assets/images/miss.jpeg'),
    videoId: 'QxLRehdk940',
  },
  {
    id: '4',
    title: 'SiLuoie',
    image: require('@/assets/images/luwi.jpeg'),
    videoId: '-gM92u3YWfs',
  },
  {
    id: '5',
    title: 'Taste',
    image: require('@/assets/images/check.jpeg'),
    videoId: '4Mk-6QK-Pqg',
  },
];

export default function Playlist() {
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Music</Text>

      {currentVideo && (
        <View style={styles.playerContainer}>
          <YoutubePlayer height={220} play={true} videoId={currentVideo} />
        </View>
      )}

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.songItem}
            onPress={() => setCurrentVideo(item.videoId)}
          >
            <Image source={item.image} style={styles.songImage} />
            <Text style={styles.songTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1DB954',
    marginBottom: 20,
    textAlign: 'center',
  },
  playerContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 10,
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  songTitle: {
    color: 'white',
    fontSize: 16,
  },
});
