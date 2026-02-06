import type { TextProps } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export type IconName = keyof typeof Ionicons.glyphMap;

interface IconProps extends TextProps {
  name: IconName;
  size: number;
  color: string;
}

export function Icon({ color, ...props }: IconProps) {
  return <Ionicons {...props} color={color} />;
}
