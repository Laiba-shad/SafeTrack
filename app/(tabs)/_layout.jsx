import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'teal',
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'index') {
            iconName = 'home-outline';
          } else if (route.name === 'task') {
            iconName = 'list-outline';
          } else if (route.name === 'circle') {
            iconName = 'people-outline';
          } else if (route.name === 'setting') {
            iconName = 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="task" options={{ title: 'Task' }} />
      <Tabs.Screen name="circle" options={{ title: 'Circle' }} />
      <Tabs.Screen name="setting" options={{ title: 'Setting' }} />
    </Tabs>
  );
}
