import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from '../../Server/context/AuthContext';
import { handleAPIError } from "../../Services/errorHandler";

export default function OTPVerification() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const { login } = useAuth();

  const handleVerify = async () => {
    if (!otp) {
      Toast.show({ type: "error", text1: "Please enter OTP" });
      return;
    }

    try {
      const res = await axios.post("http://192.168.43.38:8081/api/v1/auth/verify-otp", {
        email: email.trim(),
        otp: otp.trim()
      });

      // const res = await axios.post("http://localhost:8081/api/v1/auth/verify-email", { email, otp });
   

     await login(res.data.token); // ✅ This updates global state
Toast.show({ type: "success", text1: "OTP verified" });
// No need to manually redirect — layout will do it!

      
     // router.replace("/(tabs)")
      // RootLayout will now take you to tabs
    } catch (err) {
      Toast.show({ type: "error", text1: "Invalid OTP", text2: handleAPIError(err) });
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>OTP sent to {email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 25, backgroundColor: "#f4f9f9" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, color: "#008080", textAlign: "center" },
  subtitle: { textAlign: "center", marginBottom: 20, color: "#666" },
  input: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: "#ccc" },
  button: { backgroundColor: "#ff7f50", padding: 15, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  resendButton: { marginTop: 12, alignItems: "center" },
  resendText: { color: "#008080", fontWeight: "500", fontSize: 14 },
});
