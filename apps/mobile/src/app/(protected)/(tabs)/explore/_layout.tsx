import { Stack } from "expo-router";

export default function ExploreLayout() {
  return (
    <Stack>
      <Stack.Screen name="index">
        <Stack.Header transparent style={{ shadowColor: "transparent" }} />
        <Stack.Screen.Title>Explore</Stack.Screen.Title>
      </Stack.Screen>
    </Stack>
  );
}
