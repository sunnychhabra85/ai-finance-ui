import { registerApi } from "@/services/authApi";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { isEmailValid, isPasswordValid } from "../utils/validators";
import { AppButton } from "./AppButton";
import { AppInput } from "./AppInput";
import { Card } from "./Card";

const extractApiErrorMessage = (error: unknown, fallback: string) => {
  const rawMessage = error instanceof Error ? error.message : String(error ?? "");
  if (!rawMessage) return fallback;

  // Handles messages like: "API Error: 400 Bad Request - {\"message\":[...]}"
  const parts = rawMessage.split(" - ");
  const maybeJson = parts.length > 1 ? parts[parts.length - 1] : "";

  if (maybeJson) {
    try {
      const parsed = JSON.parse(maybeJson);
      const apiMessage = parsed?.message;

      if (Array.isArray(apiMessage) && apiMessage.length > 0) {
        return String(apiMessage[0]);
      }

      if (typeof apiMessage === "string" && apiMessage.trim()) {
        return apiMessage;
      }
    } catch {
      // Fall back to plain message when payload is not JSON.
    }
  }

  return rawMessage;
};

export const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useAuthStore((s) => s.login);

  const nameError =
    touched && name.length < 3 ? "Enter your full name" : undefined;

  const emailError =
    touched && !isEmailValid(email) ? "Enter valid email" : undefined;

  const passError =
    touched && !isPasswordValid(password)
      ? "Password must be at least 6 characters"
      : undefined;

  const isValid =
    name.length >= 3 &&
    isEmailValid(email) &&
    isPasswordValid(password);

  const handleRegister = async () => {
    try {
      setError(null);
      const res = await registerApi(email, password, name);
      const accessToken =
        res?.data?.tokens?.accessToken || res?.access_token || res?.token;
      const user = res?.data?.user ?? true;

      if (!accessToken) {
        setError("Registration succeeded, but login token is missing. Please login.");
        return;
      }

      login(accessToken, user);
      router.replace('/(tabs)/overview');
    } catch (e: any) {
      console.error('Registration error:', e);
      const errorMessage = extractApiErrorMessage(
        e,
        'Registration failed. Please try again.'
      );
      setError(errorMessage);
    }
  };

  return (
    <Card>
      {error && <Text style={styles.errorMessage}>{error}</Text>}
      <AppInput
          label="Full Name"
          icon="person-outline"
          placeholder="Enter your full name"
        value={name}
        onChangeText={(text: string) => {
          setName(text);
          setError(null);
        }}
        error={nameError}
      />
      <AppInput
          label="Email"
          icon="mail-outline"
        placeholder="Enter your email"
        value={email}
        onChangeText={(text: string) => {
          setEmail(text);
          setError(null);
        }}
        error={emailError}
      />
      <AppInput
          label="Password"
          icon="lock-closed-outline"
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={(text: string) => {
          setPassword(text);
          setError(null);
        }}
        error={passError}
      />

      <AppButton
        title="Create Account"
        disabled={!isValid}
        onPress={() => {
          setTouched(true);
          handleRegister();
        }}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
});
