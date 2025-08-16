import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { handleAPIError } from '../../Services/errorHandler';

export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); // default role

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Toast.show({ type: 'error', text1: 'Please fill all fields' });
      return;
    }

    try {
      const res = await axios.post('http://192.168.43.38:8081/api/v1/auth/register', {
      // const res = await axios.post('http://localhost:8081/api/v1/auth/register', {
        username,
        email,
        password,
        role,
      });

      Toast.show({ type: 'success', text1: 'Check your email for OTP' });

      // Pass email to OTP screen
      router.replace({
        pathname: '/(auth)/otp-verification',
        params: { email },
      });

    } catch (err) {
      const errorMessage = handleAPIError(err);
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: errorMessage
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

<View style={styles.pickerContainer}>
  <Text style={styles.pickerLabel}>Role:</Text>
  <View style={styles.radioGroup}>
    {["member", "admin"].map((option) => (
      <TouchableOpacity
        key={option}
        style={styles.radioOption}
        onPress={() => setRole(option)}
      >
        <Ionicons
          name={role === option ? "radio-button-on" : "radio-button-off"}
          size={22}
          color="#008080"
        />
        <Text style={styles.radioLabel}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>
 <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#f4f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 25, color: '#008080', textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#ccc' },
  pickerContainer: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 5 },
  pickerLabel: { padding: 8, color: '#555', fontWeight: 'bold' },
  picker: { height: 50, width: '100%' },
  button: { backgroundColor: '#ff7f50', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkText: { textAlign: 'center', color: '#008080', fontWeight: 'bold' }
});
