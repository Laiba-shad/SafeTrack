import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Pressable } from 'react-native';

export default function TabsLayout() {
  const router = useRouter();

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
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, focused }) => {
  let iconName;

  if (route.name === 'index') {
    iconName = 'home-outline';
  } else if (route.name === 'task') {
    iconName = 'calendar-outline';
  } else if (route.name === 'geofence') {
    iconName = 'location-outline'; 
  } else if (route.name === 'menu') {
    iconName = 'menu-outline';
  }

  return <Ionicons name={iconName} size={24} color={color} />;

        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="task" options={{ title: 'Task' }} />
      <Tabs.Screen name="geofence" options={{ title: 'Geofence' }} />

      {/* Trigger drawer-style screen */}
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarButton: (props) => (
            <Pressable
              {...props}
              onPress={() => router.push('/menu')}
            />
          ),
        }}
      />
    </Tabs>
  );
}
