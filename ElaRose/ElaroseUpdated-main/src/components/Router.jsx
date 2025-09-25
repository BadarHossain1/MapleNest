"use client"

import { createContext, useContext, useState } from 'react';

const RouterContext = createContext(undefined);

export function RouterProvider({ children }) {
  const [currentRoute, setCurrentRoute] = useState('/');

  const navigate = (route) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}