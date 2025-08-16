import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../Server/context/AuthContext";

export default function SettingsScreen() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout(); // ✅ clears token and triggers redirect via RootLayout
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E0F7FA",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 20,
  },
  logoutBtn: {
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
