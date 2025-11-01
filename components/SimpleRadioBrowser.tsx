import { useTheme } from "@/constants/theme/themeContext";
import { truncateString } from "@/ts/utils";
import { createAudioPlayer } from "expo-audio";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

export const SimpleRadioBrowser = () => {
  const theme = useTheme();
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("cherry");
  const [currentStation, setCurrentStation] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = "https://de1.api.radio-browser.info/json/stations/search";
      const limit = 10;
      const countryCode = "MM";
      let url = `${API_URL}?countrycode=${countryCode}&limit=${limit}&hidebroken=true&order=votes&reverse=true`;
      // url += `&name=${searchTerm}`
      const resp = await fetch(url);
      if (!resp.ok) return;
      const stations = await resp.json();
      if (!stations) return;
      for (const station of stations) {
        if (station.url_resolved) {
          station.player = createAudioPlayer(station.url_resolved);
        }
      }
      setStations(stations);
    } catch (error) {
      console.error(error);
      setError(
        "Could not load radio stations. Please check the network or API."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const onPress = () => {
    const player = station.player;
    if (!player.isLoaded) return;
    if (player.playing) {
      player.pause();
      setCurrentStation(undefined);
      return;
    }
    setCurrentStation(station);
    player.play();
  };

  if (loading) {
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }
  return (
    <ThemedView
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      {stations.map((station) => {
        return (
          <StationCard
            key={station.stationuuid}
            station={station}
            currentStation={currentStation}
            setCurrentStation={setCurrentStation}
          />
        );
      })}
    </ThemedView>
  );
};

const StationCard = ({ station, currentStation, setCurrentStation }) => {
  const theme = useTheme();
  return (
    <ThemedView
      style={{
        backgroundColor: theme.colors.card,
        alignItems: "center",
        justifyContent: "center",
        width: 180,
        borderRadius: 10,
        padding: 10,
        gap: 5,
        ...Platform.select({
          ios: {
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          },
          android: {
            elevation: 5,
          },
        }),
      }}
    >
      <TouchableOpacity
        style={{
          width: 100,
          alignItems: "center",
          backgroundColor: theme.buttonBackground,
          padding: 10,
          borderRadius: 10,
          opacity:
            station.stationuuid != currentStation?.stationuuid &&
            currentStation?.player?.playing
              ? 0.7
              : 1,
        }}
        disabled={
          station.stationuuid != currentStation?.stationuuid &&
          currentStation?.player?.playing
        }
        onPress={() => {
          const player = station.player;
          if (!player.isLoaded) return;
          if (player.playing) {
            player.pause();
            setCurrentStation(undefined);
            return;
          }
          setCurrentStation(station);
          player.play();
        }}
      >
        <ThemedText
          style={{
            color: theme.buttonText,
          }}
        >
          {station.player.playing ? "Pause" : "Play"}
        </ThemedText>
      </TouchableOpacity>
      <ThemedText>{truncateString(station.name)}</ThemedText>
    </ThemedView>
  );
};
