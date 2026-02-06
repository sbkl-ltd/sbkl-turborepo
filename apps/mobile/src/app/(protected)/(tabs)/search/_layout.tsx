import { Stack } from "expo-router";
import { useUniwind } from "uniwind";

export default function SearchLayout() {
  const { theme } = useUniwind();
  return (
    <Stack
      screenOptions={{
        headerSearchBarOptions: {
          placeholder: "Search",
          autoFocus: true,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Search",
          headerStyle: {
            backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
          },
        }}
      >
        <Stack.Header transparent style={{ shadowColor: "transparent" }} />
      </Stack.Screen>
    </Stack>
  );
}
