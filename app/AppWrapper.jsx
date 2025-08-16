import { AuthProvider } from "../Server/context/AuthContext";
import RootLayout from "./RootLayout"; // renamed to avoid circular import

export default function AppWrapper() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}