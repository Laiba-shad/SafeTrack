// app/_layout.jsx
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../Server/context/AuthContext";


function AuthNavigator() {
  const router = useRouter();
  const { appState } = useAuth();
  
  useEffect(() => {
    if (appState.status === "AUTHENTICATED") {
      router.replace("/(drawer)");
    } else if (appState.status === "AUTH") {
      router.replace("/(auth)/login");
    }
  }, [appState.status])

  if (appState.status === "LOADING") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }
  
  return <Slot />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <AuthNavigator />
    </AuthProvider>
  );
}