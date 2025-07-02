// src/contexts/ToggleDrawerContext.js

import React, { createContext, useContext, useState } from "react";

// Create a context
const ToggleDrawerContext = createContext();

// Create a custom hook to use the context
export const useToggleDrawer = () => {
  return useContext(ToggleDrawerContext);
};

// Create the provider component
export const ToggleDrawerProvider = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Function to toggle the drawer
  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  // Function to open the drawer
  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  // Function to close the drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <ToggleDrawerContext.Provider
      value={{
        isDrawerOpen,
        toggleDrawer,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </ToggleDrawerContext.Provider>
  );
};
