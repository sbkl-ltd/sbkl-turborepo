import { cn } from "@/lib/utils";
import { Platform, ScrollViewProps, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeScrollViewProps extends ScrollViewProps {
  contentClassName?: string;
}

export function SafeScrollView({
  children,
  className,
  contentClassName,
  contentInset,
  ...props
}: SafeScrollViewProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const innerInsets = {
    ...safeAreaInsets,
    bottom:
      safeAreaInsets.bottom +
      (Platform.select({ ios: 50, android: 80 }) ?? 0) +
      16,
  };
  return (
    <ScrollView
      className={cn("bg-background flex-1", className)}
      contentInset={{ ...innerInsets, ...contentInset }}
      contentContainerClassName="android:p-safe flex-row justify-center"
      {...props}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className={cn("flex-1 bg-background px-6", contentClassName)}>
        {children}
      </View>
    </ScrollView>
  );
}
