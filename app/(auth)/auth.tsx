import React, { useState } from "react";
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { LoginForm } from "../../components/LoginForm";
import { RegisterForm } from "../../components/RegisterForm";
import { colors } from "../../theme/colors";

const { width } = Dimensions.get("window");

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const switchMode = () => {
    // animate out
    translateX.value = withTiming(-width, { duration: 250 });
    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(0.95, { duration: 200 });

    setTimeout(() => {
      setMode(mode === "login" ? "register" : "login");

      // reset position to right
      translateX.value = width;
      opacity.value = 0;
      scale.value = 0.95;

      // animate in
      translateX.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withTiming(1, { duration: 300 });
    }, 250);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const isWeb = Platform.OS === 'web';

  return (
    <View style={[styles.container, isWeb && styles.webContainer]}>
      {/* Fixed Top */}
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>Ai</Text>
      </View>
      <Text style={styles.title}>
        {mode === "login" ? "Welcome Back" : "Create Account"}
      </Text>
      <Text style={styles.subtitle}>
        {mode === "login"
          ? "Sign in to access your financial insights"
          : "Join thousands mastering their finances"}
      </Text>

      {/* Animated Card */}
      <Animated.View style={animatedStyle}>
        {mode === "login" ? <LoginForm /> : <RegisterForm />}
      </Animated.View>

      <TouchableOpacity onPress={switchMode}>
        <Text style={styles.switch}>
          {mode === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        🔒 Your data is encrypted and secure
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  webContainer: {
    width: 414,
    marginHorizontal: 'auto',
    backgroundColor: colors.background,
  },
  logo: { fontSize: 40, textAlign: "center", fontWeight: "700" },
  logoBox: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    color: colors.textLight,
    marginTop: 8,
    marginBottom: 28,
  },
  switch: {
    textAlign: "center",
    marginTop: 20,
    color: colors.textLight,
  },
  logoText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 13,
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
  },
});
