import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import * as React from "react";
import type { TextProps as RNTextProps } from "react-native";
import { Text as RNText } from "react-native";

const textVariants = cva("", {
  variants: {
    color: {
      default: "text-foreground",
      primary: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive",
      muted: "text-muted-foreground",
      accent: "text-accent-foreground",
      popover: "text-popover-foreground",
      card: "text-card-foreground",
      sidebar: "text-sidebar-foreground",
    },
    size: {
      "3xl": "text-[34px] leading-[40px]",
      "2xl": "text-[28px] leading-[34px]",
      xl: "text-[22px] leading-[28px]",
      lg: "text-[20px] leading-[25px]",
      default: "text-[17px] leading-[22px]",
      sm: "text-[16px] leading-[22px]",
      xs: "text-[15px] leading-[20px]",
      "2xs": "text-[13px] leading-[18px]",
      "3xs": "text-[12px] leading-[16px]",
      "4xs": "text-[11px] leading-[13px]",
    },
    weight: {
      "extra-light": "font-extralight",
      thin: "font-thin",
      light: "font-light",
      default: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      "extra-bold": "font-extrabold",
      black: "font-black",
    },
  },
  defaultVariants: {
    size: "default",
    color: "default",
    weight: "default",
  },
});

export type TextVariantProps = VariantProps<typeof textVariants>;

export interface TextProps extends RNTextProps, TextVariantProps {}

const Text = React.forwardRef<React.ComponentRef<typeof RNText>, TextProps>(
  ({ size, color, weight, className, ...props }, ref) => (
    <RNText
      ref={ref}
      {...props}
      className={cn(textVariants({ size, color, weight, className }))}
    />
  )
);
Text.displayName = "Text";

const LargeTitle = React.forwardRef<React.ComponentRef<typeof Text>, TextProps>(
  ({ children, ...props }, ref) => (
    <Text size="3xl" {...props} ref={ref}>
      {children}
    </Text>
  )
);

LargeTitle.displayName = "LargeTitle";

const Title1 = React.forwardRef<React.ComponentRef<typeof Text>, TextProps>(
  ({ children, ...props }, ref) => (
    <Text size="2xl" {...props} ref={ref}>
      {children}
    </Text>
  )
);
Title1.displayName = "Title1";

const Title2 = React.forwardRef<React.ComponentRef<typeof Text>, TextProps>(
  ({ children, ...props }, ref) => (
    <Text size="xl" {...props} ref={ref}>
      {children}
    </Text>
  )
);
Title2.displayName = "Title2";

const Title3 = React.forwardRef<React.ComponentRef<typeof Text>, TextProps>(
  ({ children, ...props }, ref) => (
    <Text size="lg" {...props} ref={ref}>
      {children}
    </Text>
  )
);
Title3.displayName = "Title3";

const Headline = React.forwardRef<React.ComponentRef<typeof Text>, TextProps>(
  ({ children, ...props }, ref) => (
    <Text weight="semibold" {...props} ref={ref}>
      {children}
    </Text>
  )
);
Headline.displayName = "Headline";

const Callout = React.forwardRef<React.ComponentRef<typeof Text>, TextProps>(
  ({ children, ...props }, ref) => (
    <Text size="sm" {...props} ref={ref}>
      {children}
    </Text>
  )
);
Callout.displayName = "Callout";

const Subhead = React.forwardRef<React.ComponentRef<typeof Text>, TextProps>(
  ({ children, ...props }, ref) => (
    <Text size="xs" {...props} ref={ref}>
      {children}
    </Text>
  )
);
Subhead.displayName = "Subhead";

const Footnote = React.forwardRef<React.ComponentRef<typeof Text>, TextProps>(
  ({ children, ...props }, ref) => (
    <Text size="2xs" {...props} ref={ref}>
      {children}
    </Text>
  )
);
Footnote.displayName = "Footnote";

const Caption1 = React.forwardRef<React.ComponentRef<typeof Text>, TextProps>(
  ({ children, ...props }, ref) => (
    <Text size="3xs" {...props} ref={ref}>
      {children}
    </Text>
  )
);
Caption1.displayName = "Caption1";

const Caption2 = React.forwardRef<React.ComponentRef<typeof Text>, TextProps>(
  ({ children, ...props }, ref) => (
    <Text size="4xs" {...props} ref={ref}>
      {children}
    </Text>
  )
);
Caption2.displayName = "Caption2";

const Label = React.forwardRef<React.ComponentRef<typeof Text>, TextProps>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn(className)}
      size="xs"
      weight="medium"
      {...props}
    />
  )
);
Label.displayName = "Label";

export {
  Callout,
  Caption1,
  Caption2,
  Footnote,
  Headline,
  Label,
  LargeTitle,
  Subhead,
  Text,
  Title1,
  Title2,
  Title3,
};
