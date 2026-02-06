import "@/global.css";

import { SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";
import { AppProvider } from "@/providers/app-provider";
import { Slot } from "expo-router";

export default function TabLayout() {
  return (
    <SafeAreaListener
      onChange={({ insets }) => {
        Uniwind.updateInsets(insets);
      }}
    >
      <AppProvider>
        <Slot />
      </AppProvider>
    </SafeAreaListener>
  );
}
