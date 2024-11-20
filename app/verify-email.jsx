import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import Button from "../components/Button";
import Input from "../components/Input";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../lib/supabase";

const VerifyEmail = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { email, name, password } = params;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert("Verification", "Please enter the verification code");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "signup",
      options: {
        data: {
          name,
          password,
        },
      },
    });
    setLoading(false);

    if (error) {
      Alert.alert("Verification Error", error.message);
    } else {
      Alert.alert("Success", "Email verified successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/login"),
        },
      ]);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          name,
          password,
        },
      },
    });
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "New verification code sent!");
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.description}>
            We've sent a verification code to {email}. Please enter the code
            below.
          </Text>

          <Input
            placeholder="Enter 6-digit code"
            onChangeText={setOtp}
            value={otp}
            keyboardType="number-pad"
            maxLength={6}
            containerStyles={styles.otpInput}
          />

          <Button title="Verify Email" onPress={verifyOtp} loading={loading} />

          <Button
            title="Resend Code"
            onPress={resendOtp}
            buttonStyle={{ backgroundColor: "transparent" }}
            textStyle={{ color: theme.colors.primary }}
            hasShadow={false}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default VerifyEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
    justifyContent: "center",
  },
  content: {
    gap: 20,
    alignItems: "center",
  },
  title: {
    fontSize: hp(3),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    textAlign: "center",
  },
  description: {
    fontSize: hp(2),
    color: theme.colors.textLight,
    textAlign: "center",
    marginBottom: 20,
  },
  otpInput: {
    width: "60%",
    alignSelf: "center",
    marginVertical: 20,
  },
});
