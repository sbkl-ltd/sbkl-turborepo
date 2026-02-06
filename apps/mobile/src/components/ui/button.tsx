import { getTextColor } from "@/lib/colors";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import type { RectButtonProps } from "react-native-gesture-handler";
import { RectButton } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Icon, IconName } from "./icon";
import type { TextVariantProps } from "./text";
import { Text } from "./text";
import { useUniwind } from "uniwind";

const buttonColorVariants = cva("", {
  variants: {
    color: {
      default: "bg-primary",
      destructive: "bg-destructive",
      outline: "bg-background outline",
      secondary: "bg-secondary",
      ghost: "ghost bg-transparent",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

const buttonBorderColorVariants = cva("border", {
  variants: {
    color: {
      "bg-primary": "border-primary",
      "bg-destructive": "border-destructive",
      "bg-background outline": "border-input",
      "bg-secondary": "border-secondary",
      "ghost bg-transparent": "border-transparent",
    },
  },
  defaultVariants: {
    color: "bg-primary",
  },
});

const buttonTextColorVariants = cva("", {
  variants: {
    color: {
      "bg-primary": "text-primary-foreground",
      "bg-destructive": "text-destructive-foreground",
      "bg-background outline": "text-foreground",
      "bg-secondary": "text-secondary-foreground",
      "ghost bg-transparent": "text-foreground",
    },
  },
  defaultVariants: {
    color: "bg-primary",
  },
});

const buttonSizeVariants = cva("", {
  variants: {
    size: {
      default: "h-11",
      sm: "h-10 rounded-md px-3",
      lg: "h-12 rounded-md px-8",
      icon: "h-11 w-11",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface ButtonProps
  extends RectButtonProps,
    VariantProps<typeof buttonColorVariants>,
    VariantProps<typeof buttonSizeVariants> {
  loading?: boolean;
  children: string;
  textClassName?: string;
  className?: string;
  textOptions?: TextVariantProps;
  icon?:
    | IconName
    | [name: IconName, size?: number, location?: "left" | "right"];
  /**
   * Scale factor when pressed. Default is 0.98
   */
  pressScale?: number;
  /**
   * Opacity value when pressed. Default is 0.85
   */
  pressOpacity?: number;
  /**
   * Spring configuration for the animation
   */
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
}

const AnimatedRectButton = Animated.createAnimatedComponent(RectButton);

const Button = React.forwardRef<
  React.ComponentRef<typeof RectButton>,
  ButtonProps
>(
  (
    {
      className,
      color,
      size,
      loading = false,
      children,
      textClassName,
      enabled = true,
      textOptions,
      icon,
      pressScale = 0.98,
      pressOpacity = 0.85,
      springConfig = {
        damping: 15,
        stiffness: 150,
        mass: 0.8,
      },
      ...props
    },
    ref
  ) => {
    const [iconName, iconSize = 20, iconLocation = "left"] = Array.isArray(icon)
      ? icon
      : [icon, 20, "left"];
    const { theme } = useUniwind();
    const buttonColor = buttonColorVariants({ color });
    const buttonSize = buttonSizeVariants({ size });
    const buttonBorderColor = buttonBorderColorVariants({
      color: buttonColor as any,
    });
    const buttonTextColor = buttonTextColorVariants({
      color: buttonColor as any,
    });
    const iconColor = getTextColor(buttonTextColor as any, theme);

    // Animation setup
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const scaleStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const opacityStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    const handleActiveStateChange = React.useCallback(
      (active: boolean) => {
        scale.value = withSpring(active ? pressScale : 1, springConfig);
        opacity.value = withSpring(active ? pressOpacity : 1, springConfig);
      },
      [pressScale, pressOpacity, springConfig]
    );

    React.useEffect(() => {
      if (!enabled) {
        scale.value = 1;
        opacity.value = 0.5;
      } else {
        scale.value = 1;
        opacity.value = 1;
      }
    }, [enabled]);

    return (
      <AnimatedRectButton
        {...props}
        ref={ref}
        onActiveStateChange={handleActiveStateChange}
        enabled={enabled && !loading}
        style={[scaleStyle]}
      >
        <Animated.View
          style={opacityStyle}
          className={cn(
            "relative",
            "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2",
            className,
            buttonColor,
            buttonSize,
            buttonBorderColor,
            iconName && size !== "icon" ? "flex-row" : ""
          )}
        >
          {iconName && iconLocation === "left" ? (
            <Icon name={iconName} size={iconSize} color={iconColor} />
          ) : null}
          {size !== "icon" ? (
            <Text
              className={cn(
                buttonTextColor,
                loading ? "text-transparent" : "",
                textClassName
              )}
              {...textOptions}
            >
              {children}
            </Text>
          ) : null}
          {iconName && iconLocation === "right" ? (
            <Icon name={iconName} size={iconSize} color={iconColor} />
          ) : null}
          {loading ? (
            <View className="absolute">
              <ActivityIndicator size="small" className={cn(buttonTextColor)} />
            </View>
          ) : null}
        </Animated.View>
      </AnimatedRectButton>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
