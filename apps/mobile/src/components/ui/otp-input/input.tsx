import { getTextColor } from "@/lib/colors";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Text } from "../text";
import type {
  OTPInputRef,
  OTPInputProps as RNOTPInputProps,
  SlotProps,
} from "./types";
import { useInput } from "./use-input";
import { useUniwind } from "uniwind";

export const InnerOTPInput = React.forwardRef<OTPInputRef, OTPInputProps>(
  (
    {
      onChange,
      maxLength,
      pattern,
      placeholder,
      inputMode = "numeric",
      containerStyle,
      onComplete,
      render,
      ...props
    },
    ref
  ) => {
    const { inputRef, contextValue, value, handlers, actions } = useInput({
      onChange,
      maxLength,
      pattern,
      placeholder,
      defaultValue: props.defaultValue,
      onComplete,
    });

    React.useImperativeHandle(ref, () => ({
      setValue: (newValue: string) => {
        handlers.onChangeText(newValue);
      },
      focus: () => {
        actions.focus();
        // for test only we need to call onFocus
        handlers.onFocus();
      },
      blur: () => inputRef.current?.blur(),
      clear: actions.clear,
    }));

    const renderedChildren = React.useMemo(() => {
      if (render) {
        return render(contextValue);
      }
      return null;
    }, [contextValue, render]);

    const onPress = React.useCallback(() => {
      actions.focus();
      actions.clear();
    }, [actions]);

    return (
      <Pressable
        testID="otp-input-container"
        style={[styles.container, containerStyle]}
        onPress={onPress}
      >
        {renderedChildren}
        <TextInput
          {...props}
          ref={inputRef}
          style={styles.input}
          maxLength={maxLength}
          value={value}
          onChangeText={handlers.onChangeText}
          onFocus={(e) => {
            handlers.onFocus();
            props.onFocus?.(e);
          }}
          onBlur={handlers.onBlur}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
          clearTextOnFocus
          accessible
          accessibilityRole="text"
          testID="otp-input"
        />
      </Pressable>
    );
  }
);

InnerOTPInput.displayName = "InnerOTPInput";

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  input: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
    backgroundColor: "red",
  },
});

export interface OTPInputProps extends RNOTPInputProps {
  hasErrors?: boolean;
  size?: number;
  gap?: boolean;
  disabled?: boolean;
}

export const OTPInput = React.forwardRef<
  React.ComponentRef<typeof InnerOTPInput>,
  OTPInputProps
>(
  (
    { hasErrors, size = 50, gap = true, disabled = false, className, ...props },
    ref
  ) => {
    return (
      <View className={cn(className)}>
        <InnerOTPInput
          {...props}
          ref={ref}
          render={({ slots }) => {
            return (
              <View
                className={cn(
                  "flex-row items-center justify-around",
                  gap ? "gap-1.5" : ""
                )}
              >
                {slots.map((slot, idx) => (
                  <Slot
                    key={idx}
                    {...slot}
                    size={size}
                    gap={gap}
                    isFirst={idx === 0}
                    isLast={idx === props.maxLength - 1}
                    hasErrors={hasErrors}
                  />
                ))}
              </View>
            );
          }}
        />
      </View>
    );
  }
);

function Slot({
  char,
  isActive,
  hasFakeCaret,
  size = 50,
  isFirst,
  isLast,
  gap = false,
  hasErrors,
}: SlotProps & {
  size?: number;
  gap?: boolean;
  isFirst: boolean;
  isLast: boolean;
  hasErrors?: boolean;
}) {
  return (
    <View
      className={cn(
        "items-center justify-center border-y border-input bg-background",
        hasErrors ? "border-destructive" : "",
        {
          "rounded-lg border": gap,
          "rounded-l-lg border-l": !gap && isFirst,
          "rounded-r-lg border-l border-r": !gap && isLast,
          "border-l": !gap && !isFirst && !isLast,
          "border-primary": isActive,
          "border-2": isActive && gap,
        }
      )}
      style={{ width: size, height: size }}
    >
      {char !== null && (
        <Text className="text-2xl font-medium text-foreground">{char}</Text>
      )}
      {hasFakeCaret && <FakeCaret />}
    </View>
  );
}

function FakeCaret() {
  const opacity = useSharedValue(1);
  const { theme } = useUniwind();
  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const baseStyle = {
    width: 2,
    height: 28,
    backgroundColor: getTextColor("text-foreground", theme),
    borderRadius: 1,
  };

  return (
    <View className="absolute h-full w-full items-center justify-center">
      <Animated.View style={[baseStyle, animatedStyle]} />
    </View>
  );
}
