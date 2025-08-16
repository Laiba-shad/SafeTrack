import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';

export default function TabsLayout() {
  const router = useRouter();

  const tabBarIcon = useCallback(({ color, route }) => {
    const icons = {
      'index': 'home-outline',
      'task': 'calendar-outline',
      'geofence': 'location-outline',
      'menu': 'menu-outline',
    };

    return (
      <Ionicons 
        name={icons[route.name] || 'alert-circle-outline'} 
        size={24} 
        color={color} 
      />
    );
  }, []);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'teal',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0.5,
          borderTopColor: '#ccc',
          paddingBottom: 8,
          paddingTop: 6,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ color }) => tabBarIcon({ color, route }),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="task" options={{ title: 'Task' }} />
      <Tabs.Screen name="geofence" options={{ title: 'Geofence' }} />
     
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});