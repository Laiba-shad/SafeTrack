import { useEffect } from "react";
import { navigationRef } from "../navigation/NavigationRef";
import CustomDrawerContent from "./CustomDrawerContent";

export default function DrawerContentWrapper(props) {
  useEffect(() => {
    navigationRef.current = props.navigation;
    return () => {
      navigationRef.current = null;
    };
  }, [props.navigation]);

  return <CustomDrawerContent {...props} />;
}