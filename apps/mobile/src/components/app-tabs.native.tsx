import { NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";
import { useUniwind } from "uniwind";

export default function AppTabs() {
  const { theme } = useUniwind();
  return (
    <NativeTabs
      backgroundColor={theme === "dark" ? "#000000" : "#ffffff"}
      indicatorColor={theme === "dark" ? "#212225" : "#F0F0F3"}
      labelStyle={{
        selected: { color: theme === "dark" ? "#ffffff" : "#000000" },
      }}
    >
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/home.png")}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/explore.png")}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
