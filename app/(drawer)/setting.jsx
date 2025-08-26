/* eslint-disable no-dupe-keys */
// app/(drawer)/setting.jsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../Server/context/AuthContext';
import { useTheme } from '../../components/ThemeContext';

const SettingScreen = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const { currentTheme, toggleTheme, themeStyles } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    Toast.show({
      type: 'info',
      text1: `Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`
    });
  };

  const handleToggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    toggleTheme(newTheme);
    Toast.show({
      type: 'success',
      text1: `Theme changed to ${newTheme}`
    });
  };

  const handleContactUs = () => {
    Linking.openURL('mailto:ssafettrack@gmail.com?subject=SafeTrack Support Request');
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: logout }
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About SafeTrack",
      "Version 1.0.0\n\nSafeTrack helps you manage your tasks and stay connected with your circle.",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={themeStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: themeStyles.textColor }]}>Settings</Text>
      </View>
      
      {/* Preferences Section */}
      <View style={[styles.section, { backgroundColor: currentTheme === 'dark' ? '#2c2c2c' : '#ffffff' }]}>
        <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>Preferences</Text>
        
        <SettingButton 
          title="Dark Mode" 
          icon="theme-light-dark" 
          isActive={currentTheme === 'dark'} 
          onPress={handleToggleTheme} 
        />
        
        <SettingButton 
          title="Notifications" 
          icon="bell-outline" 
          isActive={notificationsEnabled} 
          onPress={handleToggleNotifications} 
        />
      </View>
      
      {/* Support Section */}
      <View style={[styles.section, { backgroundColor: currentTheme === 'dark' ? '#2c2c2c' : '#ffffff' }]}>
        <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>Support</Text>
        
        <SettingButton 
          title="Help Center" 
          icon="help-circle-outline" 
          onPress={() => {}} 
        />
        
        <SettingButton 
          title="Contact Us" 
          icon="email-outline" 
          onPress={handleContactUs} 
        />
        
        <SettingButton 
          title="About" 
          icon="information-outline" 
          onPress={handleAbout} 
        />
      </View>
      
      {/* Logout Button */}
      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: currentTheme === 'dark' ? '#c62828' : '#e53935' }]} 
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const SettingButton = ({ title, icon, onPress, isActive }) => {
  const { themeStyles } = useTheme();
  
  return (
    <TouchableOpacity style={styles.settingButton} onPress={onPress}>
      <View style={styles.titleWrapper}>
        <MaterialCommunityIcons name={icon} size={20} color={'#008080'} />
        <Text style={[styles.title, { color: themeStyles.textColor }]}>{title}</Text>
      </View>
      {isActive !== undefined && (
        <MaterialCommunityIcons
          name={isActive ? "check-circle" : "checkbox-blank-circle-outline"}
          size={20}
          color={isActive ? '#FFC107' : '#ff7f50'}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginBottom: 8,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default SettingScreen;