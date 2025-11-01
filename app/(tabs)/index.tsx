import { RadioBrowser } from "@/components/RadioBrowser";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/constants/theme/themeContext";
import { useKeepAwake } from "expo-keep-awake";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const theme = useTheme();
  useKeepAwake();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <ThemedView
        style={{
          flex: 1,
          padding: 10,
        }}
      >
        <RadioBrowser />
      </ThemedView>
    </SafeAreaView>
  );
}
