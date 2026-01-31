import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useAuthStore } from "../store/authStore";
import { isEmailValid, isPasswordValid } from "../utils/validators";
import { AppButton } from "./AppButton";
import { AppInput } from "./AppInput";
import { Card } from "./Card";

export const LoginForm = () => {
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);

  const isValid = isEmailValid(email) && isPasswordValid(password);

  return (
    <>
      <Card style={styles.card}>
        <AppInput
          label="Email"
          icon="mail-outline"
          placeholder="john@example.com"
          value={email}
          onChangeText={setEmail}
          error={touched && !isEmailValid(email) ? "Enter valid email" : ""}
        />

        <AppInput
          label="Password"
          icon="lock-closed-outline"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={
            touched && !isPasswordValid(password)
              ? "Minimum 6 characters"
              : ""
          }
        />

        <AppButton
          title="Login"
          onPress={() => {
            setTouched(true);
            if (!isValid) return;
            login(email);
            router.replace("/(tabs)/overview");
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
  footer: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 20,
    fontSize: 13,
  },
});
