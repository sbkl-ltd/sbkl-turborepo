import type { ViewProps } from "react-native";
import React from "react";
import { View } from "react-native";
import { cn } from "@/lib/utils";
import {
  AnyFieldMeta,
  createFormHook,
  createFormHookContexts,
} from "@tanstack/react-form";
import { ZodError } from "zod";

import type { OTPInputProps } from "./otp-input/input";
import type { TextInputProps } from "./text-input";
import { OTPInput } from "./otp-input/input";
import { Label, Text } from "./text";
import { TextInput } from "./text-input";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

interface ErrorFieldProps extends ViewProps {
  meta: AnyFieldMeta;
}

export function ErrorsField({ meta, className, ...props }: ErrorFieldProps) {
  if (!meta.errors.length) return null;
  return (
    <View className={cn(className)} {...props}>
      {meta.errors.map((e: ZodError | string, index) => {
        return (
          <Text
            key={index.toString()}
            className="mb-1 text-destructive"
            size="2xs"
          >
            {typeof e === "string" ? e : e.message}
          </Text>
        );
      })}
    </View>
  );
}

interface TextFieldProps extends TextInputProps {
  label?: string;
}

export const TextField = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  TextFieldProps
>(({ label, ...props }, ref) => {
  const field = useFieldContext<string>();
  const hasErrors = field.state.meta.errors.length > 0;

  return (
    <View className="w-full">
      {label ? (
        <Label className="pl-3" color={hasErrors ? "destructive" : "default"}>
          {label}
        </Label>
      ) : null}
      <TextInput
        {...props}
        ref={ref}
        className="mt-2"
        hasErrors={hasErrors}
        value={field.state.value}
        onChangeText={(value) => field.handleChange(value)}
      />
      <ErrorsField className="mt-1 pl-3" meta={field.state.meta} />
    </View>
  );
});

interface OTPFieldProps extends OTPInputProps {
  label?: string;
}

export const OTPField = React.forwardRef<
  React.ComponentRef<typeof OTPInput>,
  OTPFieldProps
>(({ label, ...props }, ref) => {
  const field = useFieldContext<string>();
  const hasErrors = field.state.meta.errors.length > 0;
  return (
    <View className="w-full">
      {label ? (
        <Label className="pl-2" color={hasErrors ? "destructive" : "default"}>
          {label}
        </Label>
      ) : null}
      <OTPInput
        {...props}
        ref={ref}
        className="mt-2"
        hasErrors={hasErrors}
        value={field.state.value}
        onChange={(value) => field.handleChange(value)}
      />
      <ErrorsField className="mt-1 pl-3" meta={field.state.meta} />
    </View>
  );
});

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    OTPField,
    TextField,
  },
  formComponents: {
    // SubscribeButton,
  },
  fieldContext,
  formContext,
});
