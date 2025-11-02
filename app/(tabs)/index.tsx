import { SimpleRadioBrowser } from "@/components/SimpleRadioBrowser";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/constants/theme/themeContext";
import { useKeepAwake } from "expo-keep-awake";

export default function Index() {
  const theme = useTheme();
  useKeepAwake();
  return (
    <ThemedView
      style={{
        flex: 1,
        paddingVertical: 10,
      }}
    >
      <SimpleRadioBrowser />
    </ThemedView>
  );
}
