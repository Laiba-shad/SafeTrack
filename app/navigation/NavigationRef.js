import { createRef } from 'react';

export const navigationRef = createRef();

export const toggleDrawer = () => {
  if (navigationRef.current) {
    navigationRef.current.toggleDrawer();
  }
}; export default toggleDrawer;