import { getTextColor } from "@/lib/colors";
import { cn } from "@/lib/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import type { TextInputProps as RNTextInputProps } from "react-native";
import { TextInput as RNTextInput, View } from "react-native";

import { Icon } from "./icon";
import { useUniwind } from "uniwind";

export type TextInputIcon = {
  name: keyof typeof Ionicons.glyphMap;
  size: number;
};

export interface TextInputProps extends RNTextInputProps {
  icon?: TextInputIcon;
  disabled?: boolean;
  hasErrors?: boolean;
  type?: "email" | "password" | "text" | "number";
}

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  function Input(
    { type, hasErrors, icon, className = "", disabled = false, ...props },
    ref
  ) {
    const { theme } = useUniwind();
    const mutedColor = getTextColor("text-muted-foreground", theme);
    const innerTextInputProps: RNTextInputProps =
      type === "email"
        ? {
            keyboardType: "email-address",
            autoComplete: "off",
            autoCapitalize: "none",
            autoCorrect: false,
            spellCheck: false,
            returnKeyType: "go",
          }
        : {};
    return (
      <View
        className={cn(
          "relative h-12 flex-row items-center rounded-md border border-input",
          hasErrors ? "border-destructive" : "",
          className,
          disabled ? "opacity-50" : ""
        )}
      >
        {icon ? (
          <View className="items-center justify-center p-3">
            <Icon {...icon} color={mutedColor} className="opacity-50" />
          </View>
        ) : null}

        <View className="flex-1">
          <RNTextInput
            {...props}
            {...innerTextInputProps}
            editable={!disabled}
            selectTextOnFocus={!disabled}
            ref={ref}
            style={{ lineHeight: 18, fontSize: 16 }}
            className="h-full text-foreground"
            placeholderTextColor={mutedColor}
          />
        </View>
      </View>
    );
  }
);
