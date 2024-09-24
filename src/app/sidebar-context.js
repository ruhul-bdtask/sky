// app/sidebar-context.js
"use client";

import { createContext, useContext, useState } from "react";

// Create the context
const SidebarContext = createContext();

// Create a provider component
export function SidebarProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Hook to access the Sidebar context
export function useSidebar() {
  return useContext(SidebarContext);
}
