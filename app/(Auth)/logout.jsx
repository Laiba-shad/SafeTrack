// AuthContext.js or inside your RootLayout if no context
import { useAuth } from "../../Server/context/AuthContext";

export default function useAuthActions() {
const { logout } = useAuth();

const handleLogout = async () => {
  await logout(); // this clears token AND updates appState
};


  return { logout };
}
