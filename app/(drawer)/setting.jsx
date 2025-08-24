import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Stack } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Alert, AppState, Linking, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import SettingButton from "../../components/SettingButton";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../Server/context/AuthContext";

import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "react-native-vector-icons";
import AntDesign from "react-native-vector-icons/AntDesign";

import * as Location from 'expo-location';



const Setting = () => {
  const { currentTheme, toggleTheme } = useContext(ThemeContext);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);

  // 🔹 Notification states
  const [geofenceEnter, setGeofenceEnter] = useState(false);
  const [geofenceExit, setGeofenceExit] = useState(false);
  const [newPersonAdded, setNewPersonAdded] = useState(false);
  const [personLeft, setPersonLeft] = useState(false);
  const [sosAlert, setSosAlert] = useState(false);
  const [lowBattery, setLowBattery] = useState(false);
  const [locationReminder, setLocationReminder] = useState(false);
  const [taskAssigned, setTaskAssigned] = useState(false);
  const [taskAccepted, setTaskAccepted] = useState(false);
  const [taskDenied, setTaskDenied] = useState(false);

  const { logout } = useAuth();

const handleLogout = async () => {
  await logout(); 
};
  const toggleDarkMode = () => {
    setIsDarkModeEnabled(prev => !prev);
    toggleTheme(currentTheme === "light" ? "dark" : "light");
  };

  // Location ON/OFF logic
  const toggleLocation = async () => {
    if (!isLocationEnabled) {
      let { status } = await Location.getForegroundPermissionsAsync();

      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        console.log("Location ON:", loc);
        setIsLocationEnabled(true);
      } 
      else if (status === 'denied') {
        Alert.alert(
          "Permission Required",
          "Location access is denied. Please enable it in settings.",
          [
            { text: "Cancel", style: "cancel", onPress: () => setIsLocationEnabled(false) },
            { 
              text: "Go to Settings", 
              onPress: async () => {
                await Linking.openSettings();
              }
            }
          ]
        );
      } 
      else {
        let { status: requestStatus } = await Location.requestForegroundPermissionsAsync();
        if (requestStatus === 'granted') {
          let loc = await Location.getCurrentPositionAsync({});
          console.log("Location ON:", loc);
          setIsLocationEnabled(true);
        } else {
          setIsLocationEnabled(false);
        }
      }
    } 
    else {
      console.log("Location OFF");
      setIsLocationEnabled(false);
    }
  };

  // 🔹 Jab app foreground me aaye to permission re-check
  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextState) => {
      if (nextState === "active") {
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          setIsLocationEnabled(true);
        } else {
          setIsLocationEnabled(false);
        }
      }
    });

    return () => subscription.remove();
  }, []);

  const navigation = useNavigation();

  return (
    <>
      <ScrollView>
        <Stack.Screen options={{ title: 'Settings' }} />
        <View style={styles.container}>

          {/* --- Theme Switch --- */}
          <Text style={styles.title}>Theme Switch</Text>
          <TouchableOpacity style={styles.button}>
            <Text>
              <MaterialIcons name="dark-mode" size={24} color="#FFA500" /> 
              DarkMode
            </Text>
            <Switch
              trackColor={{ false: '#008080', true: '#efd39eff' }}
              thumbColor={isDarkModeEnabled ? '#008080' : '#f3f0eaff'}
              onValueChange={toggleDarkMode}
              value={isDarkModeEnabled}
              style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
            />
          </TouchableOpacity>

          {/* --- Theme Setting Buttons --- */}
          <Text style={styles.title}>Theme Setting</Text>
          <SettingButton title='Light' icon='bulb' onPress={() => toggleTheme("light")} isActive={currentTheme === "light"} />
          <SettingButton title='Dark' icon='moon' onPress={() => toggleTheme("dark")} isActive={currentTheme === "dark"} />
          <SettingButton title='System' icon='color-filter-sharp' onPress={() => toggleTheme("system")} isActive={currentTheme === "system"} />

          {/* --- Privacy --- */}
          <Text style={styles.title}>Privacy Setting</Text>
          <TouchableOpacity>
            <Text style={styles.button} onPress={() => navigation.navigate("profile")}>
              <MaterialIcons name="mode-edit" size={20} color="#FFA500" /> Edit Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.privacyUpdate} onPress={() => navigation.navigate("profile")}>
            <MaterialIcons name="email" size={24} color="#008080" />
            <MaterialIcons name="password" size={24} color="#008080" />
            <Text style={{ fontWeight: 500 }}>Change Email & Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.privacyUpdate} onPress={() => navigation.navigate("(tabs)/add-person")}>
            <MaterialIcons name="people" size={24} color="#008080" />
            <Text style={{ fontWeight: 500 }}>Manage Family Members</Text>
          </TouchableOpacity>

          {/* --- Location --- */}
          <Text style={styles.title}>Location & Notification</Text>
          <TouchableOpacity style={styles.button}>
            <Text>
              <Ionicons name="location" size={24} color="#FFA500" /> Location Sharing On / Off
            </Text>
            <Switch
              trackColor={{ false: '#008080', true: '#efd39eff' }}
              thumbColor={isLocationEnabled ? '#008080' : '#f3f0eaff'}
              onValueChange={toggleLocation}
              value={isLocationEnabled}
              style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
            />
          </TouchableOpacity>

          {/* --- Notification Preferences --- */}
          <Text style={styles.title}>
            <Ionicons name="notifications-outline" size={24} color="#FFA500" />
            Notification Preferences</Text>

          {/* Geofence */}
          <TouchableOpacity style={styles.blankButton}>
            <Text>When Person Enters Geofence</Text>
            <Switch value={geofenceEnter} onValueChange={setGeofenceEnter} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.blankButton}>
            <Text>When Person Exits Geofence</Text>
            <Switch value={geofenceExit} onValueChange={setGeofenceExit} />
          </TouchableOpacity>

          {/* Family Changes */}
          <Text style={styles.title}>
            <MaterialIcons name="family-restroom" size={24} color="#FFA500" />
            Family Member changes</Text>
          <TouchableOpacity style={styles.blankButton}>
            <Text>When New Person is Added</Text>
            <Switch value={newPersonAdded} onValueChange={setNewPersonAdded} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.blankButton}>
            <Text>When Someone Leaves the App</Text>
            <Switch value={personLeft} onValueChange={setPersonLeft} />
          </TouchableOpacity>

          

          {/* Tasks */}
          <Text style={styles.title}>
            <MaterialIcons name="task" size={24} color="#FFA500" />
            Task Notification</Text>
          <TouchableOpacity style={styles.blankButton}>
            <Text>When Task is Assigned</Text>
            <Switch value={taskAssigned} onValueChange={setTaskAssigned} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.blankButton}>
            <Text>When Task is Accepted</Text>
            <Switch value={taskAccepted} onValueChange={setTaskAccepted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.blankButton}>
            <Text>When Task is Denied</Text>
            <Switch value={taskDenied} onValueChange={setTaskDenied} />
          </TouchableOpacity>

          {/* Logout */}
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.logoutText}>Logout</Text>
      <AntDesign name="logout" color="#008080" size={18} />

              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    marginTop: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    fontFamily: 'Poppins-semibold',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#39e0e0ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  blankButton : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  logout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  privacyUpdate: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'stretch',
    fontFamily: 'Poppins-semibold',
    paddingVertical: 19,
    height: 60,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#f2ede4ff',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 12,
  },
  logoutText: {
    fontSize: 18,
    fontFamily: 'Poppins-bold',
    color: '#FFA500',
  }
});