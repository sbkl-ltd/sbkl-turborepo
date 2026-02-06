import {
  useConfirmSignIn,
  useSignIn,
  useUser,
} from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form";

import { OTPInput } from "@/components/ui/otp-input/input";
import { Spacer } from "@/components/ui/spacer";

import { ConvexError } from "convex/values";
import { router } from "expo-router";
import * as React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { z } from "zod";
import { Text } from "@/components/ui/text";

const emailFormSchema = z.object({
  email: z.email("Invalid email"),
});

const codeFormSchema = emailFormSchema.extend({
  code: z.string().length(6, "Invalid code"),
});

export default function LoginScreen() {
  const { isAuthenticated } = useUser();
  const signIn = useSignIn();
  const confirmSignIn = useConfirmSignIn();

  const [step, setStep] = React.useState<"email" | "code">("email");

  const otpFieldRef = React.useRef<React.ComponentRef<typeof OTPInput>>(null);

  const codeForm = useAppForm({
    defaultValues: {
      email: "",
      code: "",
    },
    validators: {
      onSubmit: codeFormSchema,
    },
    onSubmit: async (values) => {
      try {
        otpFieldRef.current?.blur();
        await confirmSignIn({
          email: values.value.email,
          code: values.value.code,
        });

        router.replace("/");
      } catch (error) {
        codeForm.fieldInfo.code.instance?.setErrorMap({
          onSubmit: "Code could not be verified",
        });
      }
    },
  });
  const emailForm = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: emailFormSchema,
    },
    onSubmit: async (values) => {
      try {
        await signIn({
          provider: "OTP",
          email: values.value.email,
        });
        codeForm.setFieldValue("email", values.value.email);
        setStep("code");
      } catch (error) {
        if (error instanceof ConvexError) {
          if (step === "email") {
            emailForm.fieldInfo.email.instance?.setErrorMap({
              onSubmit: "Invalid email",
            });
          } else {
            codeForm.fieldInfo.code.instance?.setErrorMap({
              onSubmit: "Code could not be resent",
            });
          }
        }
      }
    },
  });

  async function handleGoogleLogin() {
    await signIn({
      provider: "GoogleOAuth",
    });

    console.log("Google login successful");
  }

  console.log("isAuthenticated", isAuthenticated);

  if (isAuthenticated) {
    return (
      <View className="flex-1 content-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerClassName="flex-1"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <Pressable onPress={Keyboard.dismiss} className="flex-1 justify-center">
          <View className="mx-auto -mt-96 w-screen px-8 sm:w-[450px]">
            <Spacer height={54} />
            {step === "email" ? (
              <>
                <emailForm.AppField
                  name="email"
                  children={(field) => (
                    <field.TextField
                      label="Email"
                      type="email"
                      icon={{ name: "mail", size: 20 }}
                      disabled={emailForm.state.isSubmitting}
                      onSubmitEditing={emailForm.handleSubmit}
                    />
                  )}
                />
                <Spacer />
                <Button
                  onPress={emailForm.handleSubmit}
                  enabled={!emailForm.state.isSubmitting}
                  loading={emailForm.state.isSubmitting}
                >
                  Request Code
                </Button>
                <Spacer />
                <Button icon="logo-google" onPress={handleGoogleLogin}>
                  Sign In with Google
                </Button>
              </>
            ) : (
              <>
                <codeForm.AppField
                  name="code"
                  children={(field) => (
                    <field.OTPField
                      ref={otpFieldRef}
                      label="Enter your code"
                      disabled={codeForm.state.isSubmitting}
                      maxLength={6}
                      onFocus={() => {
                        otpFieldRef.current?.setValue("");
                      }}
                      onComplete={codeForm.handleSubmit}
                    />
                  )}
                />
                <Spacer />
                <Button
                  onPress={codeForm.handleSubmit}
                  enabled={!codeForm.state.isSubmitting}
                  loading={codeForm.state.isSubmitting}
                >
                  Confirm Code
                </Button>
                <Spacer />
                <Button
                  color="outline"
                  onPress={emailForm.handleSubmit}
                  enabled={!emailForm.state.isSubmitting}
                  loading={emailForm.state.isSubmitting}
                >
                  Resend Code
                </Button>
              </>
            )}
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
