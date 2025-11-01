import { useTheme } from "@/constants/theme/themeContext";
import { Theme } from "@/constants/theme/types";
import { truncateString } from "@/ts/utils";
import { Audio } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

export const RadioBrowser = () => {
  const AUDIO_STATE = {
    NO_AUDIO: 0,
    BUFFERING: 1,
    LOADED: 2,
    PLAYING: 3,
  };

  const theme = useTheme();
  const styles = createStyles(theme);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("cherry");
  const [currentStation, setCurrentStation] = useState(null);
  const [currentStationState, setCurrentStationState] = useState(
    AUDIO_STATE.NO_AUDIO
  );
  const audioRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function configureAudioMode() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecording: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true, // Allows playback even if the device is set to silent
        playThroughEarpieceAndroid: false, // Use speaker by default
        shouldDuckAndroid: true, // Audio lowers volume when notifications come in
        // Using numerical values (2 = DO_NOT_MIX) for robustness against constant errors
        interruptionModeIOS: 2,
        interruptionModeAndroid: 2,
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    configureAudioMode();
    return () => {
      if (audioRef.current) {
        audioRef.current.unloadAsync();
      }
    };
  }, []);

  const playStation = async (station) => {
    if (!station || !station.url_resolved) {
      console.error(
        "Invalid station object or missing resolved URL: ",
        station
      );
      return;
    }

    if (audioRef.current) {
      await audioRef.current.stopAsync();
      await audioRef.current.unloadAsync();
      audioRef.current = null;
    }
    setCurrentStation(station);

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: station.url_resolved },
        { shouldPlay: true, isLooping: true },
        (status) => {
          if (status.isLoaded) {
            setCurrentStationState(AUDIO_STATE.LOADED);
          } else {
            setCurrentStationState(AUDIO_STATE.BUFFERING);
          }
          if (status.isPlaying) {
            setCurrentStationState(AUDIO_STATE.PLAYING);
          }
        }
      );
      audioRef.current = sound;
      setIsPlaying(true);
    } catch (error) {
      console.error(error);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      await audioRef.current.pauseAsync();
    } else {
      await audioRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const fetchStations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = "https://de1.api.radio-browser.info/json/stations/search";
      const limit = 10;
      const countryCode = "MM";
      let url = `${API_URL}?limit=${limit}&hidebroken=true&order=votes&reverse=true`;
      url += `&countrycode=${countryCode}`;
      // url += `&name=${searchTerm}`
      const resp = await fetch(url);
      if (!resp.ok) return;
      const stations = await resp.json();
      if (!stations) return;
      setStations(stations);
    } catch (error) {
      console.error(error);
      setError(
        "Oops. Could not load radio stations. Please check your network."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Radio Stations</ThemedText>
      {error ? (
        <ThemedText style={styles.error}>{error}</ThemedText>
      ) : stations.length == 0 ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
        </ThemedView>
      ) : (
        <FlatList
          data={stations}
          keyExtractor={(item) => item.stationuuid}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.stationItem}
              onPress={() => playStation(item)}
            >
              <ThemedText style={styles.stationName}>
                {truncateString(item.name, 50)}
              </ThemedText>
              <ThemedText style={styles.stationTags}>
                {item.country} | {item.language} | votes:{item.clickcount} |
                votes:{item.votes}
              </ThemedText>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 120 }} // Keep list scrollable above controls
        />
      )}

      <ThemedView style={styles.controls}>
        <ThemedText style={styles.nowPlaying}>
          {currentStation
            ? `Now Playing: ${currentStation.name}`
            : "Select a Station"}
        </ThemedText>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={togglePlayPause}
          disabled={!currentStation}
        >
          {currentStationState == AUDIO_STATE.BUFFERING ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <ThemedText style={styles.buttonText}>
              {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
            </ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      paddingHorizontal: 5,
    },
    error: {
      color: "red",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    stationItem: {
      gap: 10,
      backgroundColor: theme.colors.card,
      marginHorizontal: 5,
      marginVertical: 5,
      borderRadius: 10,
      padding: 10,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    stationName: {
      fontSize: 16,
      fontWeight: "600",
    },
    stationTags: {
      fontSize: 12,
    },
    controls: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 10,
      gap: 10,
    },
    nowPlaying: {
      fontSize: 16,
      fontWeight: "500",
    },
    controlButton: {
      backgroundColor: theme.buttonBackground,
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 5,
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 18,
      fontWeight: "bold",
    },
  });
