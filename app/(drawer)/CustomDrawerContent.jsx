// app/(drawer)/CustomDrawerContent.jsx
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function CustomDrawerContent(props) {
  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>SafeTrack</Text>
      </View>
      <TouchableOpacity 
        style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}
        onPress={() => props.navigation.navigate('(tabs)')}
      >
        <Ionicons name="home-outline" size={22} color="#333" style={{ marginRight: 15 }} />
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}
        onPress={() => props.navigation.navigate('profile')}
      >
        <Ionicons name="person-outline" size={22} color="#333" style={{ marginRight: 15 }} />
        <Text>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}
        onPress={() => props.navigation.navigate('setting')}
      >
        <Ionicons name="settings-outline" size={22} color="#333" style={{ marginRight: 15 }} />
        <Text>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}