import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from '../../Server/context/AuthContext';
import API from '../../constants/api';

const CustomInput = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  maxLength, 
  editable = true, 
  icon, 
  keyboardType = 'default',
  secureTextEntry = false,
  showPasswordToggle = false,
  onTogglePassword
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        {icon}
        <TextInput
          style={[styles.input, !editable && styles.inputDisabled]}
          placeholder={placeholder}
          placeholderTextColor="#666"
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          editable={editable}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
        />
        {showPasswordToggle && (
          <TouchableOpacity onPress={onTogglePassword} style={styles.eyeIcon}>
            <Ionicons 
              name={secureTextEntry ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#ff7f50" 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { appState, updateUser } = useAuth();
  
  // Form states - these are controlled components
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState(null);
  const [circleName, setCircleName] = useState('');
  
  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Email change states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
  
  // Load user profile on component mount and when appState changes
  useEffect(() => {
    loadUserProfile();
  }, [appState.user]);
  
const loadUserProfile = async () => {
  setLoading(true);
  try {
    const user = appState.user;
    if (user) {
      // Set initial values from auth context
      setName(user.username || '');
      setEmail(user.email || '');
      setRole(user.role || '');
      
      try {
        const res = await API.get('/users/profile');
        // Make sure we're accessing the correct data structure
        const profileData = res.data.user;
        setPhone(profileData.phone || '');
        setAddress(profileData.address || '');
        setImage(profileData.profileImage || null);
        
        if (res.data.circle) {
          setCircleName(res.data.circle.name || '');
        }
      } catch (error) {
        console.log('Profile data not found, using defaults');
      }
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    Alert.alert('Error', 'Failed to load profile data');
  } finally {
    setLoading(false);
  }
};
  const showImageOptions = () => {
    if (!image) {
      Alert.alert(
        "Select Profile Picture",
        "Choose how you want to add your profile picture",
        [
          { text: "Camera", onPress: takePhoto },
          { text: "Gallery", onPress: pickImage },
          { text: "Cancel", style: 'cancel' }
        ]
      );
    } else {
      Alert.alert(
        "Profile Picture",
        "What would you like to do?",
        [
          { text: "View", onPress: () => setShowImageModal(true) },
          { text: "Edit", onPress: showEditImageOptions },
          { text: "Cancel", style: 'cancel' }
        ]
      );
    }
  };
  
  const showEditImageOptions = () => {
    Alert.alert(
      "Edit Profile Picture",
      "Choose a new profile picture",
      [
        { text: "Camera", onPress: takePhoto },
        { text: "Gallery", onPress: pickImage },
        { text: "Remove", onPress: () => setImage(null), style: 'destructive' },
        { text: "Cancel", style: 'cancel' }
      ]
    );
  };
  
  const showImageViewOptions = () => {
    Alert.alert(
      "Profile Picture",
      "",
      [
        { text: "Delete", onPress: () => { setImage(null); setShowImageModal(false); }, style: 'destructive' },
        { text: "Cancel", style: 'cancel' }
      ]
    );
  };
  
  const requestCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Camera Permission Required",
          "Please allow camera access to take photos",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Settings", onPress: () => ImagePicker.requestCameraPermissionsAsync() }
          ]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  };
  
  const requestGalleryPermission = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Gallery Permission Required",
          "Please allow gallery access to select photos",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Settings", onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync() }
          ]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting gallery permission:', error);
      return false;
    }
  };
  
  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };
  
  const pickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };
  
  const handleBackPress = () => {
    if (isEditing) {
      Alert.alert(
        "Discard Changes",
        "Are you sure you want to go back? Your changes will be lost.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Discard", onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };
  
  const handleEditToggle = () => {
    if (isEditing) {
      Alert.alert(
        "Discard Changes",
        "Are you sure you want to discard your changes?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Discard", 
            onPress: () => {
              // Reset all fields to their original values
              setName(appState.user.username || '');
              setPhone(appState.user.phone || '');
              setAddress(appState.user.address || '');
              setImage(appState.user.profileImage || null);
              setIsEditing(false);
            }
          }
        ]
      );
    } else {
      setIsEditing(true);
    }
  };
  
  const handleSaveProfile = async () => {
  const updateData = {};
  let hasChanges = false;
  
  if (name !== appState.user.username) {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty');
      return;
    }
    updateData.username = name;
    hasChanges = true;
  }
  
  if (phone !== (appState.user.phone || '')) {
    if (phone && (!isPhoneValid || !phone.startsWith('03'))) {
      Alert.alert('Validation Error', 'Phone number must be 11 digits and start with 03');
      return;
    }
    updateData.phone = phone;
    hasChanges = true;
  }
  
  if (address !== (appState.user.address || '')) {
    updateData.address = address;
    hasChanges = true;
  }
  
  if (image && image !== appState.user.profileImage) {
    updateData.profileImage = image;
    hasChanges = true;
  }
  
  if (!hasChanges) {
    Alert.alert('No Changes', 'No changes were made to your profile');
    return;
  }
  
  setSaving(true);
  setIsUpdating(true);
  try {
    console.log('Sending update data:', updateData);
    const response = await API.put('/users/profile', updateData);
    
    if (response.data.success) {
      // Get the updated user data from the response
      const updatedUserData = response.data.user;
      
      // Update the auth context with the updated user data
      const updatedUser = {
        ...appState.user,
        ...response.data.user
      };
      updateUser(updatedUser);
      
      // Update the local state with the values we just saved
      setName(updatedUser.username);
      setPhone(updatedUser.phone || '');
      setAddress(updatedUser.address || '');
      setImage(updatedUser.profileImage || null);
      
      setIsEditing(false);
      
      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully!'
      });
      
      // Then refresh data in background to ensure consistency
      setTimeout(async () => {
        try {
          // Only fetch circle data if needed
          if (appState.user.circleId) {
            const circleRes = await API.get(`/circle/${appState.user.circleId}`);
            setCircleName(circleRes.data.name || '');
          }
        } catch (error) {
          console.log('Background refresh failed:', error);
        }
      }, 500);
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    Alert.alert('Error', 'Failed to save profile. Please try again.');
  } finally {
    setSaving(false);
    setIsUpdating(false);
  }
};
  
  
  const handleChangeEmail = async () => {
    if (!newEmail || !currentPasswordForEmail) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    try {
      // Request email change (sends verification email)
      const response = await API.post('/users/request-email-change', {
        email: newEmail,
        password: currentPasswordForEmail
      });
      
      if (response.data.success) {
        // Reset form
        setNewEmail('');
        setCurrentPasswordForEmail('');
        setShowEmailModal(false);
        
        Alert.alert(
          'Verification Email Sent',
          `We've sent a verification email to ${newEmail}. Please check your inbox and click the link to complete the email change.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting email change:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to request email change');
    }
  };
  
  const handleChangePassword = () => {
    // Navigate to change password screen
    router.push('/(auth)/forgot-password');
  };
  
  const handlePhoneChange = (text) => {
    const onlyDigits = text.replace(/[^0-9]/g, '');
    
    if (onlyDigits.length <= 11) {
      if (onlyDigits.length > 0 && !onlyDigits.startsWith('03')) {
        if (onlyDigits.length === 1 && onlyDigits === '0') {
          setPhone('03');
        } else if (onlyDigits.length === 1 && onlyDigits === '3') {
          setPhone('03');
        } else {
          setPhone('03' + onlyDigits);
        }
      } else {
        setPhone(onlyDigits);
      }
    }
  };
  
  const isPhoneValid = phone.length === 11 && phone.startsWith('03');
  
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff7f50" />
          <Text style={styles.loadingText}>Loading Profile...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          
          {/* Header with Back Button and Edit Button */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleBackPress} style={styles.headerButton}>
              <Ionicons name="arrow-back" size={24} color="#ff7f50" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Profile</Text>
            
            <TouchableOpacity onPress={handleEditToggle} style={styles.headerButton}>
              <Feather 
                name={isEditing ? "x" : "edit"} 
                size={20} 
                color="#ff7f50" 
              />
            </TouchableOpacity>
          </View>
          
          {/* Profile Image Section */}
          <View style={styles.profileImageContainer}>
            <TouchableOpacity 
              style={styles.imagePicker} 
              onPress={isEditing ? showImageOptions : (image ? showImageOptions : null)}
              disabled={!isEditing && !image}
            >
              {image ? (
                <>
                  <Image source={{ uri: image }} style={styles.previewImage} />
                  {isEditing && (
                    <View style={styles.editOverlay}>
                      <Ionicons name="camera-outline" size={18} color="#fff" />
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons name="person-outline" size={50} color="#ff7f50" />
                  <Text style={styles.placeholderText}>
                    {isEditing ? "Tap to add photo" : "No photo"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Name and Role */}
          <View style={styles.nameRoleContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.role}>{role}</Text>
            {circleName && (
              <Text style={styles.circle}>Circle: {circleName}</Text>
            )}
          </View>
          
          {/* Input Fields */}
          <View style={styles.inputFieldContainer}>
            <CustomInput
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              maxLength={50}
              editable={isEditing}
              icon={<Ionicons name="person-outline" size={20} color="#ff7f50" />}
            />
            
            <CustomInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              maxLength={100}
              editable={false}
              icon={<Feather name="mail" size={20} color="#ff7f50" />}
              keyboardType="email-address"
            />
            
            {isEditing && (
              <TouchableOpacity 
                style={styles.linkButton} 
                onPress={() => setShowEmailModal(true)}
              >
                <Text style={styles.linkButtonText}>Change Email</Text>
              </TouchableOpacity>
            )}
            
            <CustomInput
              label="Address"
              placeholder="Enter your address"
              value={address}
              onChangeText={setAddress}
              maxLength={100}
              editable={isEditing}
              icon={<Ionicons name="location-outline" size={20} color="#ff7f50" />}
            />
            
            <CustomInput
              label="Phone Number"
              placeholder="03xxxxxxxxx"
              value={phone}
              onChangeText={handlePhoneChange}
              maxLength={11}
              editable={isEditing}
              keyboardType="numeric"
              icon={<Ionicons name="call-outline" size={20} color="#ff7f50" />}
            />
            
            {isEditing && phone.length > 0 && !isPhoneValid && (
              <Text style={styles.errorText}>Phone number must be 11 digits and start with 03</Text>
            )}
            
            <CustomInput
              label="Password"
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              maxLength={16}
              editable={false}
              icon={<AntDesign name="lock" size={20} color="#ff7f50" />}
              secureTextEntry={!showPassword}
              showPasswordToggle={true}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
            
            {isEditing && (
              <TouchableOpacity 
                style={styles.linkButton} 
                onPress={handleChangePassword}
              >
                <Text style={styles.linkButtonText}>Change Password</Text>
              </TouchableOpacity>
            )}
            
            <CustomInput
              label="Role"
              placeholder="Enter your role"
              value={role}
              onChangeText={setRole}
              maxLength={30}
              editable={false}
              icon={<Feather name="user" size={20} color="#ff7f50" />}
            />
          </View>
          
          {/* Save Button - Only show when editing */}
          {isEditing && (
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Feather name="save" size={20} color="#fff" />
              )}
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Full Screen Image Modal */}
      <Modal visible={showImageModal} transparent={true} animationType="fade">
        <View style={styles.imageModalContainer}>
          <TouchableOpacity 
            style={styles.imageModalBackground} 
            onPress={() => setShowImageModal(false)}
          >
            <View style={styles.imageModalContent}>
              <Image source={{ uri: image }} style={styles.fullImage} />
              <View style={styles.imageModalButtons}>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={showImageViewOptions}
                >
                  <Text style={styles.buttonText}>Options</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setShowImageModal(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      
      {/* Email Change Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEmailModal}
        onRequestClose={() => setShowEmailModal(false)}
      >
        <View style={styles.emailModalOverlay}>
          <View style={styles.emailModalContainer}>
            <Text style={styles.modalTitle}>Change Email</Text>
            
            <TextInput
              style={styles.textInput}
              placeholder="New Email"
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.textInput}
              placeholder="Current Password"
              value={currentPasswordForEmail}
              onChangeText={setCurrentPasswordForEmail}
              secureTextEntry
            />
            
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setShowEmailModal(false)} />
              <Button title="Change Email" onPress={handleChangeEmail} />
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Updating Overlay */}
      {isUpdating && (
        <View style={styles.updatingOverlay}>
          <View style={styles.updatingCard}>
            <ActivityIndicator size="large" color="#ff7f50" />
            <Text style={styles.updatingText}>Updating Profile</Text>
            <Text style={styles.updatingSubtext}>Please wait a moment...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  keyboardView: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 15,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  headerButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  profileImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  imagePicker: {
    width: 140,
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#ff7f50',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#ff7f50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: {
    marginTop: 10,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 10,
    fontSize: 12
  },
  previewImage: {
    width: 140,
    height: 140,
    resizeMode: 'cover'
  },
  editOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#ff7f50',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  nameRoleContainer: {
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  role: {
    fontSize: 14,
    color: '#008080',
    marginTop: 5,
    fontWeight: '500'
  },
  circle: {
    fontSize: 12,
    color: '#ff7f50',
    marginTop: 5,
    fontWeight: '500'
  },
  inputFieldContainer: {
    marginTop: 10
  },
  inputContainer: {
    marginBottom: 15
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginLeft: 5
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 50
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 10,
    fontSize: 14,
    color: '#333'
  },
  inputDisabled: {
    color: '#666'
  },
  eyeIcon: {
    padding: 5,
    marginLeft: 5
  },
  saveButton: {
    backgroundColor: '#ff7f50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: '#ff7f50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10
  },
  linkButton: {
    alignSelf: 'flex-end',
    marginTop: 5,
    marginBottom: 10,
  },
  linkButtonText: {
    color: '#ff7f50',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#e74c3c',
    marginLeft: 15,
    marginTop: 3,
    fontSize: 11,
    fontWeight: '500'
  },
  bottomSpacing: {
    height: 20
  },
  // Image Modal Styles
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)'
  },
  imageModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageModalContent: {
    alignItems: 'center'
  },
  fullImage: {
    width: 280,
    height: 280,
    resizeMode: 'contain',
    borderRadius: 15
  },
  imageModalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 15
  },
  // Email Modal Styles
  emailModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  emailModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#ff7f50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10
  },
  closeButton: {
    backgroundColor: '#008080',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },
  updatingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  updatingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  updatingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  updatingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});