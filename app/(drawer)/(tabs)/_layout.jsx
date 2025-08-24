// app/(drawer)/(tabs)/_layout.jsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";
import { toggleDrawer } from "../../navigation/NavigationRef";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "orange",
        tabBarInactiveTintColor: "teal",
        headerShown: true, // Show header for tabs
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitle: '',
        headerLeft: () => (
          <TouchableOpacity 
            style={{ marginLeft: 15 }} 
            onPress={toggleDrawer}
          >
            <Ionicons name="menu" size={24} color="#008080" />
          </TouchableOpacity>
        ),
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "index") iconName = "home-outline";
          else if (route.name === "task") iconName = "list-outline";
          else if (route.name === "geofence") iconName = "location-outline";
          else if (route.name === "add-person") iconName = "person-add-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="task" options={{ title: "Task" }} />
      <Tabs.Screen name="geofence" options={{ title: "Geofence" }} />
      <Tabs.Screen name="add-person" options={{ title: "Add Person" }} />
    </Tabs>
  );
}