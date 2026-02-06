import { useSignOut, useUser } from "@/providers/auth-provider";
import { Stack, useRouter } from "expo-router";
import { useUniwind, Uniwind } from "uniwind";

export default function HomeLayout() {
  const { user } = useUser();
  const signOut = useSignOut();
  const { theme } = useUniwind();
  const router = useRouter();

  function handleThemeChange(theme: "light" | "dark") {
    Uniwind.setTheme(theme);
  }

  function openSheet() {
    router.push("/(protected)/(tabs)/(home)/sheet");
  }

  return (
    <Stack>
      <Stack.Screen name="index">
        <Stack.Header transparent style={{ shadowColor: "transparent" }} />
        <Stack.Screen.Title>Home</Stack.Screen.Title>
        <Stack.Toolbar placement="left">
          <Stack.Toolbar.Button icon="sidebar.left" onPress={() => {}} />
        </Stack.Toolbar>
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Menu title={user?.name ?? "Guest"}>
            <Stack.Toolbar.Icon sf="ellipsis.circle" />
            <Stack.Toolbar.MenuAction
              icon="square.and.arrow.up"
              onPress={openSheet}
            >
              Share
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.Menu title="Theme" icon="macwindow">
              <Stack.Toolbar.MenuAction
                icon="sun.max"
                isOn={theme === "light"}
                onPress={() => handleThemeChange("light")}
              >
                Light
              </Stack.Toolbar.MenuAction>
              <Stack.Toolbar.MenuAction
                icon="moon"
                isOn={theme === "dark"}
                onPress={() => handleThemeChange("dark")}
              >
                Night Mode
              </Stack.Toolbar.MenuAction>
            </Stack.Toolbar.Menu>
            <Stack.Toolbar.Spacer width={48} />
            <Stack.Toolbar.MenuAction
              onPress={signOut}
              destructive
              icon={"rectangle.portrait.and.arrow.right"}
            >
              Sign Out
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        </Stack.Toolbar>
      </Stack.Screen>
      <Stack.Screen
        name="sheet"
        options={{
          presentation: "formSheet",
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.5, 1.0],
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </Stack>
  );
}
