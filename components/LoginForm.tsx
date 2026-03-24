import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { loginApi } from '../services/authApi';
import { useAuthStore } from "../store/authStore";
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


export const LoginForm = () => {
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = isEmailValid(email) && isPasswordValid(password);

  const handleLogin = async () => {
    try {
      setError(null);
      const res = await loginApi(email, password);

      login(res.data.tokens.accessToken, res.data.user ?? true);
      router.replace('/(tabs)/overview');
    } catch (e: any) {
      const errorMessage = extractApiErrorMessage(
        e,
        'Login failed. Please try again.'
      );
      setError(errorMessage);
    }
  };

  return (
    <>
      <Card style={styles.card}>
        {error && <Text style={styles.errorMessage}>{error}</Text>}
        <AppInput
          label="Email"
          icon="mail-outline"
          placeholder="Enter your email"
          value={email}
          onChangeText={(text: string) => {
            setEmail(text);
            setError(null);
          }}
          error={touched && !isEmailValid(email) ? "Enter valid email" : undefined}
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
          error={
            touched && !isPasswordValid(password)
              ? "Minimum 6 characters"
              : undefined
          }
        />

        <AppButton
          title="Login"
          onPress={() => {
            setTouched(true);
            if (!isValid) return;
            handleLogin();
          }}
          disabled={!isValid}
        />
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 22,
    borderRadius: 20,
  },
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
  footer: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 20,
    fontSize: 13,
  },
});
