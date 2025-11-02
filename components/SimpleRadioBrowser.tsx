import { useTheme } from "@/constants/theme/themeContext";
import { searchStations } from "@/service/radio_stations";
import { truncateString } from "@/ts/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

export const SimpleRadioBrowser = () => {
  const theme = useTheme();
  const styles = createStyles();

  const player = useAudioPlayer(undefined);
  const playerStatus = useAudioPlayerStatus(player);
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStation, setCurrentStation] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const [isFirstLoaded, setIsFirstLoaded] = useState(false);

  useEffect(() => {
    if (!currentStation) return;
    player.replace(currentStation.url_resolved);
  }, [currentStation]);

  useEffect(() => {
    async function configureAudioMode() {
      try {
        await setAudioModeAsync({
          allowsRecording: false,
          shouldPlayInBackground: true,
          playsInSilentMode: true,
          shouldRouteThroughEarpiece: false,
          interruptionModeIOS: "doNotMix",
          interruptionModeAndroid: "doNotMix",
        });
      } catch (error) {
        console.error(error);
      }
    }
    configureAudioMode();
  }, []);

  const fetchStations = useCallback(async (searchTerm, countryCode) => {
    setLoading(true);
    setError(undefined);
    try {
      const stations = await searchStations(searchTerm, countryCode);
      setStations(stations);
    } catch (error) {
      console.error(error);
      setError("Could not load radio stations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isFirstLoaded) {
      fetchStations(searchTerm, "MM");
      setIsFirstLoaded(true);
      return;
    }
    fetchStations(searchTerm);
  }, [searchTerm]);

  const onSelStations = async (station) => {
    setError(undefined);
    if (!station || !station.url_resolved) {
      console.error("Invalid station: ", station);
      setError("Invalid station!");
      return;
    }
    if (player.playing) {
      player.pause();
    }
    setCurrentStation(station);
    player.play();
  };

  const togglePlayPause = async () => {
    if (!currentStation) return;
    if (player.playing) {
      await player.pause();
      return;
    }
    await player.play();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.inputContainer}>
        <Ionicons name="search" size={24} color={theme.colors.text} />
        <TextInput
          style={styles.input}
          placeholder="Search stations here...."
          value={searchTerm}
          onChangeText={(v) => setSearchTerm(v)}
          placeholderTextColor={theme.colors.text}
        />
      </ThemedView>

      <ThemedView style={[styles.container, styles.alignCenter]}>
        {loading ? (
          <ThemedView style={styles.loadingContainer}>
            <ThemedText>Loading Radio Stations...</ThemedText>
            <ActivityIndicator size="large" color="#4a90e2" />
          </ThemedView>
        ) : error ? (
          <ThemedText style={styles.error}>{error}</ThemedText>
        ) : (
          <ScrollView>
            <ThemedView style={styles.stationsContainer}>
              {stations.map((station) => {
                return (
                  <TouchableOpacity
                    style={[
                      currentStation?.stationuuid == station.stationuuid &&
                        styles.selStationCard,
                    ]}
                    activeOpacity={0.8}
                    key={station.stationuuid}
                    onPress={() => onSelStations(station)}
                  >
                    <StationCard station={station} />
                  </TouchableOpacity>
                );
              })}
            </ThemedView>
          </ScrollView>
        )}
      </ThemedView>

      {/* Controls */}
      <ThemedView style={styles.controls}>
        <ThemedText style={styles.nowPlaying}>
          {currentStation
            ? `Now Playing: ${currentStation.name}`
            : "Select a Station"}
        </ThemedText>
        <TouchableOpacity
          style={[
            styles.controlButton,
            !currentStation && styles.disabledButton,
          ]}
          onPress={togglePlayPause}
          disabled={!currentStation}
          activeOpacity={!currentStation ? 1 : 0.7}
        >
          {playerStatus.isBuffering ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <ThemedText style={styles.buttonText}>
              {player.playing ? "⏸ PAUSE" : "▶ PLAY"}
            </ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const StationCard = ({ station }) => {
  const styles = createStyles();
  return (
    <ThemedView style={styles.stationCard}>
      <ThemedText style={styles.stationName}>
        {truncateString(station.name, 10)}
      </ThemedText>
      <ThemedText style={styles.stationInfo}>
        {truncateString(station.country, 10)}
      </ThemedText>
      <ThemedText style={styles.stationInfo}>
        {truncateString(station.language, 10)}
      </ThemedText>
    </ThemedView>
  );
};

export const createStyles = () => {
  const theme = useTheme();
  const window = Dimensions.get("window");
  return StyleSheet.create({
    container: {
      flex: 1,
      gap: 20,
    },
    alignCenter: {
      justifyContent: "center",
      alignItems: "center",
    },
    inputContainer: {
      flexDirection: "row",
      marginHorizontal: 15,
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 10,
      paddingHorizontal: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      flex: 1,
      height: 50,
      flexDirection: "row",
      color: theme.colors.text,
    },
    loadingContainer: {
      gap: 20,
    },
    error: {
      color: "red",
    },
    stationsContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 15,
      paddingTop: 10,
      paddingBottom: 150,
    },
    stationCard: {
      backgroundColor: theme.colors.card,
      alignItems: "center",
      justifyContent: "center",
      width: window.width / 2.3,
      borderRadius: 10,
      padding: 10,
      gap: 5,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    selStationCard: {
      borderWidth: 1,
      borderColor: "lightblue",
      borderRadius: 10,
      shadowColor: "blue",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    stationName: {
      fontSize: 16,
      fontWeight: "600",
    },
    stationInfo: {
      fontSize: 12,
    },
    controls: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 10,
      gap: 10,
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: "gray",
      borderRadius: 10,
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
    disabledButton: {
      backgroundColor: "#A0A0A0",
      opacity: 0.6,
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 18,
      fontWeight: "bold",
    },
  });
};
