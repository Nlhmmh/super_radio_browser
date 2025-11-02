import { DarkTheme, LightTheme } from "@/constants/theme/theme";
import { ThemeProvider } from "@/constants/theme/themeContext";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : LightTheme;
  return (
    <SafeAreaProvider>
      <ThemeProvider currentTheme={theme}>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
