import AppTabs from "@/components/app-tabs";
import { Text } from "@/components/ui/text";
import { useUser } from "@/providers/auth-provider";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function ProtectedLayout() {
  const { isPending, isAuthenticated } = useUser();

  if (isPending) {
    return (
      <View className="flex-1 content-center">
        <Text>Loading...</Text>
      </View>
    );
  }
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }
  return <AppTabs />;
}
