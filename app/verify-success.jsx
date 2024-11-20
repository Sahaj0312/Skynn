import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../lib/supabase";

const VerifySuccess = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleVerificationSuccess = async () => {
      // Get the access_token from the URL params
      const { access_token, refresh_token } = params;

      if (access_token) {
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (!error && data) {
          Alert.alert("Success", "Email verified successfully!", [
            {
              text: "OK",
              onPress: () => router.push("/login"),
            },
          ]);
        }
      }
    };

    handleVerificationSuccess();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Verifying your email...</Text>
    </View>
  );
};

export default VerifySuccess;
