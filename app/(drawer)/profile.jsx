import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomInput from '../../components/CustomInput';
import Header from "../../components/header";

const Profilescreen = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // image
  const showImageOptions = () => {
    let options = [];

    if (image) {
      options.push({ text: "View Image", onPress: () => setShowImageModal(true) });
      options.push({ text: "Delete Image", onPress: () => setImage(null) });
    }

    options.push({ text: "Take Photo", onPress: takePhoto });
    options.push({ text: "Choose from Gallery", onPress: pickImage });
    options.push({ text: "Cancel", onPress: () => { }, style: 'cancel' });

    Alert.alert("Select Option", "", options.map(o => ({
      text: o.text,
      onPress: o.onPress,
      style: o.style || "default"
    })));
  };

  // setting
  const handlePermissionDenied = (retryFn) => {
    Alert.alert(
      "Permission Required",
      "Please allow access from settings to continue",
      [
        { text: "Go to Settings", onPress: () => Linking.openSettings() },
        { text: "Retry", onPress: retryFn },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  // Camera
  const takePhoto = async () => {
    const { status, canAskAgain } = await ImagePicker.getCameraPermissionsAsync();

    if (status !== 'granted') {
      const { status: requestStatus, canAskAgain: canRetry } = await ImagePicker.requestCameraPermissionsAsync();

      if (requestStatus !== 'granted') {
        if (!canRetry) {
          handlePermissionDenied(takePhoto);
        }
        return;
      }
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Gallery
  const pickImage = async () => {
    const { status, canAskAgain } = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      const { status: requestStatus, canAskAgain: canRetry } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (requestStatus !== 'granted') {
        if (!canRetry) {
          handlePermissionDenied(pickImage);
        }
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Validation functions
  const isEmailValid = email.endsWith('@gmail.com');
  const isPasswordValid = password.length >= 8 && password.length <= 16;
  const isPhoneValid = phone.length === 11;

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 40 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView style={styles.container}>

          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={25} color="#ff7f50" />
          </TouchableOpacity>

          <Header />

          <View style={styles.profileimagecontainer}>
            <Text style={styles.title}>Profile Image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={showImageOptions}>
              {image ? (
                <Image source={{ uri: image }} style={styles.preViewImage} />
              ) : (
                <View style={styles.placeHolderContainer}>
                  <Ionicons name="image-outline" size={30} color="#FFA500" />
                  <Text style={styles.placeholderText}>Select an Image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Name and Role */}
          <View style={styles.nameRoleContainer}>
            <Text style={styles.name}>Hamad Hussain</Text>
            <Text style={styles.role}>Parent</Text>
          </View>

          {/* Input Fields */}
          <View style={styles.inputFieldContainer}>
            <CustomInput
              label="Your Email"
              placeholder="abcdef@gmail.com"
              value={email}
              onChangeText={setEmail}
              maxLength={100}
              icon={<Feather name="mail" size={20} color="#FFA500" style={styles.icons} />}
            />
            {!isEmailValid && email.length > 0 && (
              <Text style={styles.errorText}>Email must end with @gmail.com</Text>
            )}

            <CustomInput
              label="Your Address"
              placeholder="Lahore, Pakistan"
              maxLength={100}
              icon={<Ionicons name="location-outline" size={20} color="#FFA500" style={styles.icons} />}
            />
            <CustomInput
              label="Phone Number"
              placeholder="0300000000"
              value={phone}
              onChangeText={(text) => {
                const onlyDigits = text.replace(/[^0-9]/g, '');
                if (onlyDigits.length <= 11) {
                  setPhone(onlyDigits);
                }
              }}
              maxLength={11}
              keyboardType="numeric"
              icon={<Ionicons name="call-outline" size={20} color="#FFA500" style={styles.icons} />}
            />
            {!isPhoneValid && phone.length > 0 && (
              <Text style={styles.errorText}>Phone number must be 11 digits</Text>
            )}

            <CustomInput
              label="Your Password"
              placeholder="******"
              value={password}
              onChangeText={setPassword}
              maxLength={16}
              icon={<AntDesign name="lock" size={20} color="#FFA500" style={styles.icons} />}
              type="password"
            />
            {!isPasswordValid && password.length > 0 && (
              <Text style={styles.errorText}>Password must be between 8 and 16 characters</Text>
            )}
          </View>

          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editButtonText}>
                <Feather name="save" size={20} color="#FFA500" style={styles.icons} />
                Save Profile
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* image model full screen wala */}
      <Modal visible={showImageModal} transparent={true}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: image }} style={styles.fullImage} />
          <TouchableOpacity style={styles.deleteButton} onPress={() => { setImage(null); setShowImageModal(false); }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowImageModal(false)}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profilescreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  backButton: { marginBottom: 10 },
  profileimagecontainer: { justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  imagePicker: {
    width: 150,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 75,
    borderWidth: 1,
    borderColor: '#FFA500',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeHolderContainer: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { marginTop: 8, color: '#181717', fontWeight: 'bold' },
  preViewImage: { width: 150, height: 150, resizeMode: 'cover' },
  nameRoleContainer: { alignItems: 'center', marginVertical: 20 },
  name: { fontSize: 20, color: '#000' },
  role: { fontSize: 18, color: '#000' },
  icons: { marginHorizontal: 10 },
  inputFieldContainer: { marginTop: 20 },
  editProfileButton: {
    borderWidth: 1, borderColor: '#FFA500', padding: 8, alignItems: 'center',
    justifyContent: 'center', borderRadius: 8, marginVertical: 12, marginTop: 20, paddingVertical: 15,
  },
  editButtonText: { fontSize: 16, color: '#FFA500' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  fullImage: { width: '90%', height: '70%', resizeMode: 'contain' },
  deleteButton: { backgroundColor: 'red', padding: 10, marginTop: 20, borderRadius: 8 },
  closeButton: { backgroundColor: 'gray', padding: 10, marginTop: 10, borderRadius: 8 },
  errorText: { color: 'red', marginLeft: 10, marginTop: 5 }
});
