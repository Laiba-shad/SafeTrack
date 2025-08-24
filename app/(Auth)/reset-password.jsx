import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "../../Server/context/AuthContext";
import API from "../../constants/api";

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleResetPassword = async () => {
    if (loading) return;
    
    if (!otp || !newPassword || !confirmPassword) {
      Toast.show({ type: "error", text1: "Please fill all fields" });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Toast.show({ type: "error", text1: "Passwords do not match" });
      return;
    }
    
    if (newPassword.length < 8) {
      Toast.show({ type: "error", text1: "Password must be at least 8 characters" });
      return;
    }
    
    setLoading(true);
    try {
      const res = await API.post("/auth/reset-password", {
        token: otp,
        newPassword: newPassword,
      });
      
      // Log the user in automatically
      await login(res.data.token, res.data.user);
      
      Toast.show({ type: "success", text1: "Password reset successful" });
      
      // Navigate to the home page (drawer)
      setTimeout(() => {
        router.replace("/(drawer)");
      }, 1500);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Password reset failed",
        text2: err.response?.data?.message || "An error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to {email}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="#aaa"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
      />
      
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && { backgroundColor: "#ccc" }]} 
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.linkText}>Back</Text>
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
    fontSize: 16,
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
  },
  linkText: {
    textAlign: "center",
    color: "#008080",
    fontWeight: "bold",
  }
});