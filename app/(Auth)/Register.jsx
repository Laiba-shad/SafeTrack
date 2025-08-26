import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { handleAPIError } from '../../Services/errorHandler';
import API from '../../constants/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); 
  const [circleName, setCircleName] = useState(''); 
  const [joinCode, setJoinCode] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Toast.show({ type: 'error', text1: 'Please fill all fields' });
      return;
    }

    if (role === 'member' && !joinCode) {
      Toast.show({ type: 'error', text1: 'Member must have join code' });
      return;
    }

    if (role === 'admin' && !circleName) {
      Toast.show({ type: 'error', text1: 'Admin must provide circle name' });
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/register', {
        username,
        email,
        password,
        role,
        ...(role === 'admin' ? { circleName } : {}),
        ...(role === 'member' ? { joinCode } : {})
      });
      
      Toast.show({ type: 'success', text1: 'Check your email for OTP' });
      
      // Pass email to OTP screen
      router.replace({
        pathname: '/(auth)/otp-verification',
        params: { email, role, ...(role === 'admin' && { circleName }) }
      });
    } catch (err) {
      const errorMessage = handleAPIError(err);
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      {/* Username */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />
      
      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      {/* Role Selection */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Select Role</Text>
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
      
      {/* Circle Name for Admin */}
      {role === "admin" && (
        <TextInput
          style={styles.input}
          placeholder="Enter Circle Name"
          placeholderTextColor="#aaa"
          value={circleName}
          onChangeText={setCircleName}
        />
      )}
      
      {/* Join Code for Member */}
      {role === "member" && (
        <TextInput
          style={styles.input}
          placeholder="Enter Join Code"
          placeholderTextColor="#aaa"
          value={joinCode}
          onChangeText={setJoinCode}
        />
      )}
      
      {/* Register Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creating Account..." : "Sign Up"}</Text>
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
  pickerContainer: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 10 },
  pickerLabel: { fontSize: 16, marginBottom: 8, color: '#555', fontWeight: 'bold' },
  radioGroup: { flexDirection: 'row', justifyContent: 'space-around' },
  radioOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  radioLabel: { marginLeft: 6, fontSize: 16, color: '#333' },
  button: { backgroundColor: '#ff7f50', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkText: { textAlign: 'center', color: '#008080', fontWeight: 'bold' }
});