// app/RootLayout.jsx
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../Server/context/AuthContext";

export default function RootLayout() {
  const { appState } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (appState.status === "LOADING") return;

    const inAuthGroup = segments[0] === "(auth)";
    if (appState.status === "AUTH" && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (appState.status === "AUTHENTICATED" && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [appState.status, segments]);

  if (appState.status === "LOADING") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00BFA6" />
      </View>
    );
  }
  

  return <Slot />;
}