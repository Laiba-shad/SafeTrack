import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import API from '../constants/api';

const VerifyEmailScreen = () => {
  const { token } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await API.get(`/users/verify-email-change?token=${token}`);
        
        if (response.data.success) {
          setSuccess(true);
          Toast.show({
            type: 'success',
            text1: 'Email verified successfully!',
          });
          
          // Redirect to profile after a delay
          setTimeout(() => {
            router.replace('/(tabs)/profile');
          }, 2000);
        }
      } catch (error) {
        console.error('Email verification error:', error);
        Alert.alert(
          'Verification Failed',
          error.response?.data?.message || 'Failed to verify email. The link may have expired.',
          [
            { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
          ]
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setLoading(false);
      Alert.alert(
        'Invalid Link',
        'The verification link is invalid.',
        [
          { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
        ]
      );
    }
  }, [token]);

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#ff7f50" />
          <Text style={styles.message}>Verifying your email...</Text>
        </>
      ) : success ? (
        <>
          <Text style={styles.successText}>✓</Text>
          <Text style={styles.message}>Email verified successfully!</Text>
          <Text style={styles.subMessage}>Redirecting to your profile...</Text>
        </>
      ) : (
        <>
          <Text style={styles.errorText}>✗</Text>
          <Text style={styles.message}>Verification failed</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
  },
  subMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
  successText: {
    fontSize: 60,
    color: '#4CAF50',
  },
  errorText: {
    fontSize: 60,
    color: '#F44336',
  },
});

export default VerifyEmailScreen;