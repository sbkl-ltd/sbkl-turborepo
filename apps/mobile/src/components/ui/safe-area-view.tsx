import { View, ViewProps } from "react-native";

export function SafeAreaView({ children, className, ...props }: ViewProps) {
  return (
    <View className="flex-1 bg-background p-safe">
      <View className={className} {...props}>
        {children}
      </View>
    </View>
  );
}
