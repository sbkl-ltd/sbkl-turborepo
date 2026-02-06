import {
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from "expo-router/ui";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: "100%" }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/(protected)/(tabs)/(home)" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/(protected)/(tabs)/explore" asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  ...props
}: TabTriggerSlotProps) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) =>
        pressed && {
          opacity: 0.7,
        }
      }
    >
      <View className="py-1 px-4 rounded">
        <Text className="small">{children}</Text>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View
      {...props}
      className="absolute w-full p-4 justify-center items-center flex-row"
    >
      <View className="px-8 py-2 rounded-lg flex-row items-center grow gap-2">
        <Text className="smallBold mr-auto">Expo Starter</Text>

        {props.children}
      </View>
    </View>
  );
}
