import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../Server/context/AuthContext';
import { handleAPIError } from '../../Services/errorHandler';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!email.trim() || !password.trim()) {
      Toast.show({ type: 'error', text1: 'Please fill all fields' });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://192.168.43.38:8081/api/v1/auth/login', {
        email: email.trim(),
        password: password.trim()
      });

    await AsyncStorage.setItem("token", res.data.token);
      Toast.show({ type: 'success', text1: 'Login successful' });
          router.replace("/(tabs)");

      // RootLayout will redirect automatically
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Login failed', text2: handleAPIError(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
        <Text style={{ color: 'teal', textAlign: 'center' }}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
        <Text style={styles.linkText}>Don’t have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#f4f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 25, color: '#008080', textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#ccc' },
  button: { backgroundColor: '#ff7f50', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkText: { textAlign: 'center', color: '#008080', fontWeight: 'bold' }
});