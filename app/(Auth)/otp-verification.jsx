import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from '../../Server/context/AuthContext';
import { handleAPIError } from "../../Services/errorHandler";
import API from "../../constants/api";

export default function OTPVerification() {
  const { email, role, circleName } = useLocalSearchParams();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleVerify = async () => {
    if (loading) return;
    if (!otp) {
      Toast.show({ type: "error", text1: "Please enter OTP" });
      return;
    }

    setLoading(true);
    try {
      const requestBody = {
        email: email.trim(),
        otp: otp.trim()
      };

      if (role === 'admin') {
        requestBody.circleName = circleName;
      }

      console.log("Final request body being sent:", JSON.stringify(requestBody));

      const res = await API.post(
        "/auth/verify-otp",
        requestBody,
        { headers: { "Content-Type": "application/json" } }
      );
    const user = res.data.user;
    await login(res.data.token, user);


      Toast.show({ type: "success", text1: "OTP verified" });
      
      router.replace("/(drawer)");  

    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Verification failed",
        text2: handleAPIError(err)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>OTP sent to {email}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="#aaa"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && { backgroundColor: "#ccc" }]} 
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 25, 
    backgroundColor: "#f4f9f9" 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 10, 
    color: "#008080", 
    textAlign: "center" 
  },
  subtitle: { 
    textAlign: "center", 
    marginBottom: 20, 
    color: "#666" 
  },
  input: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: "#ccc",
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 8
  },
  button: { 
    backgroundColor: "#ff7f50", 
    padding: 15, 
    borderRadius: 12, 
    alignItems: "center",
    marginBottom: 15
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  }
});