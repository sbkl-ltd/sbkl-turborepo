import { View } from "react-native";

export function Spacer({ height = 16 }: { height?: number }) {
  return <View className={`w-full`} style={{ height }} />;
}
