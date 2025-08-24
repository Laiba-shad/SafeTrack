// app/(drawer)/(tabs)/index.jsx
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SafeTrack</Text>
      <Text style={styles.subtitle}>This is the home screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#008080',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});