import { StyleSheet, Text, View, Alert, TextInput } from "react-native";
import React, { useState, useRef } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import Button from "../components/Button";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../lib/supabase";

const VerifyEmail = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { email, name, password } = params;
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([...Array(6)].map(() => React.createRef()));

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      Alert.alert(
        "Verification",
        "Please enter the complete verification code"
      );
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otpString,
      type: "signup",
      options: {
        data: { name, password },
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
        data: { name, password },
      },
    });
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "New verification code sent!");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].current.focus();
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Please check your email</Text>
            <Text style={styles.description}>We've sent a code to {email}</Text>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs.current[index]}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <Text style={styles.resendText}>
            Didn't get the code?{" "}
            <Text style={styles.resendButton} onPress={resendOtp}>
              Click to resend
            </Text>
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => router.back()}
              buttonStyle={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              hasShadow={false}
            />
            <Button
              title="Verify"
              onPress={verifyOtp}
              loading={loading}
              buttonStyle={styles.verifyButton}
            />
          </View>
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
    backgroundColor: "white",
  },
  content: {
    gap: 30,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    gap: 10,
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
  },
  otpContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },
  otpInput: {
    width: wp(12),
    height: wp(12),
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme.colors.primary,
    fontSize: hp(2.5),
    textAlign: "center",
    color: theme.colors.primary,
    backgroundColor: "white",
  },
  resendText: {
    fontSize: hp(1.8),
    color: theme.colors.textLight,
  },
  resendButton: {
    color: theme.colors.primary,
    textDecorationLine: "underline",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.textLight,
  },
  cancelButtonText: {
    color: theme.colors.text,
  },
  verifyButton: {
    flex: 1,
  },
});
