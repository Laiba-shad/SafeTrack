import axios from "axios";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    try {
      const res = await axios.post("http://192.168.43.38:8081/api/v1/auth/forgot-password", { email });
      setMessage("Password reset link sent to your email.");
    } catch (error) {
      console.error(error);
      setMessage("Error sending reset link.");
    }
  };

  return (
    <View>
      <Text>Enter your email to reset password:</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Button title="Send Reset Link" onPress={handleForgotPassword} />
      {message && <Text>{message}</Text>}
    </View>
  );
}
