import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useReducer, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Song = {
  id: string;
  name: string;
};

type State = {
  playlist: Song[];
  history: Song[];
};

type Action =
  | { type: "ADD_SONG"; payload: Song }
  | { type: "REMOVE_SONG"; payload: string }
  | { type: "CLEAR_PLAYLIST" }
  | { type: "LOAD_STATE"; payload: State };

const initialState: State = {
  playlist: [],
  history: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_SONG":
      return {
        playlist: [...state.playlist, action.payload],
        history: [...state.history, action.payload],
      };
    case "REMOVE_SONG":
      return {
        ...state,
        playlist: state.playlist.filter((song) => song.id !== action.payload),
      };
    case "CLEAR_PLAYLIST":
      return { ...state, playlist: [] };
    case "LOAD_STATE":
      return action.payload;
    default:
      return state;
  }
}

export default function PlaylistApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [songName, setSongName] = useState("");

  // Load saved state on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const json = await AsyncStorage.getItem("playlistState");
        if (json) {
          dispatch({ type: "LOAD_STATE", payload: JSON.parse(json) });
        }
      } catch (e) {
        console.error("Failed to load playlist:", e);
      }
    };
    loadData();
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("playlistState", JSON.stringify(state));
      } catch (e) {
        console.error("Failed to save playlist:", e);
      }
    };
    saveData();
  }, [state]);

  const addSong = () => {
    if (!songName.trim()) return;
    const newSong: Song = { id: Date.now().toString(), name: songName.trim() };
    dispatch({ type: "ADD_SONG", payload: newSong });
    setSongName("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎵 Playlist Manager</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter song name"
        placeholderTextColor="#aaa"
        value={songName}
        onChangeText={setSongName}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btn} onPress={addSong}>
          <Text style={styles.btnText}>Add Song</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "red" }]}
          onPress={() => dispatch({ type: "CLEAR_PLAYLIST" })}
        >
          <Text style={styles.btnText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeader}>Current Playlist</Text>
      <FlatList
        data={state.playlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.songItem}>
            <Text style={styles.song}>{item.name}</Text>
            <TouchableOpacity
              onPress={() =>
                dispatch({ type: "REMOVE_SONG", payload: item.id })
              }
            >
              <Text style={styles.remove}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text style={styles.subHeader}>History</Text>
      <FlatList
        data={state.history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.historyItem}>• {item.name}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", color: "#1DB954", marginBottom: 20 },
  subHeader: { fontSize: 18, fontWeight: "600", color: "white", marginTop: 20 },
  input: {
    backgroundColor: "#222",
    color: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  btn: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  btnText: { color: "white", fontWeight: "bold" },
  songItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#1c1c1c",
    borderRadius: 8,
    marginVertical: 5,
  },
  song: { color: "white", fontSize: 16 },
  remove: { color: "red", fontSize: 16 },
  historyItem: { color: "#aaa", marginVertical: 2 },
});
