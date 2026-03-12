"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface EditModeContextType {
  isEditMode: boolean;
  setEditMode: (value: boolean) => void;
  isAdmin: boolean;
}

const EditModeContext = createContext<EditModeContextType>({
  isEditMode: false,
  setEditMode: () => {},
  isAdmin: false,
});

export function useEditMode() {
  return useContext(EditModeContext);
}

interface EditModeProviderProps {
  children: React.ReactNode;
  isAdmin: boolean;
}

export function EditModeProvider({ children, isAdmin }: EditModeProviderProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      setIsEditMode(false);
    }
  }, [isAdmin]);

  return (
    <EditModeContext.Provider
      value={{
        isEditMode: isAdmin && isEditMode,
        setEditMode: setIsEditMode,
        isAdmin,
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
}
