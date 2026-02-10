import { registerApi } from "@/services/authApi";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";
import { isEmailValid, isPasswordValid } from "../utils/validators";
import { AppButton } from "./AppButton";
import { AppInput } from "./AppInput";
import { Card } from "./Card";

export const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);

  const login = useAuthStore((s) => s.login);

  const nameError =
    touched && name.length < 3 ? "Enter your full name" : "";

  const emailError =
    touched && !isEmailValid(email) ? "Enter valid email" : "";

  const passError =
    touched && !isPasswordValid(password)
      ? "Password must be at least 6 characters"
      : "";

  const isValid =
    name.length >= 3 &&
    isEmailValid(email) &&
    isPasswordValid(password);

  const handleRegister = async () => {
  try {
    const res = await registerApi(email, password);
    login(res.access_token);
    router.replace('/(tabs)/overview');
  } catch (e) {
    Alert.alert('Register failed');
  }
};

  return (
    <Card>
      <AppInput
        placeholder="John Doe"
        value={name}
        onChangeText={setName}
        error={nameError}
      />
      <AppInput
        placeholder="john@example.com"
        value={email}
        onChangeText={setEmail}
        error={emailError}
      />
      <AppInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
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
