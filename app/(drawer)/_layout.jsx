// app/(drawer)/_layout.jsx
import { createDrawerNavigator } from "@react-navigation/drawer";
import { withLayoutContext } from "expo-router";
import DrawerContentWrapper from "./DrawerContentWrapper";

const DrawerNavigator = createDrawerNavigator();
const Drawer = withLayoutContext(DrawerNavigator.Navigator);

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <DrawerContentWrapper {...props} />}
      screenOptions={{
        // Hide the header for the drawer navigator
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{ 
          headerShown: false, // Hide header for tabs in drawer
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="setting"
        options={{ headerShown: false }}
      />
    </Drawer>
  );
}