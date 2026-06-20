"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface OverlayContextType {
  overlay: boolean;
  setOverlay: (v: boolean) => void;
}

const OverlayContext = createContext<OverlayContextType>({
  overlay: false,
  setOverlay: () => {},
});

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState(false);
  return (
    <OverlayContext.Provider value={{ overlay, setOverlay }}>
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  return useContext(OverlayContext);
}
