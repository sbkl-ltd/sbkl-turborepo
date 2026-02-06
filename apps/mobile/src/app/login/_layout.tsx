import { useUser } from "@/providers/auth-provider";
import { Redirect, Slot } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native-gesture-handler";
import * as React from "react";

export default function LoginLayout() {
  const { isPending, isAuthenticated } = useUser();

  if (isPending) {
    return (
      <View className="flex-1 content-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log("isAuthenticated", isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return <Slot />;
}
