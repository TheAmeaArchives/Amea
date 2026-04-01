"use client";

import React, { createContext, useContext, useState } from "react";

interface EditModeContextType {
  isEditMode: boolean;
  setEditMode: (value: boolean) => void;
  canEditSiteContent: boolean;
}

const EditModeContext = createContext<EditModeContextType>({
  isEditMode: false,
  setEditMode: () => {},
  canEditSiteContent: false,
});

export function useEditMode() {
  return useContext(EditModeContext);
}

interface EditModeProviderProps {
  children: React.ReactNode;
  canEditSiteContent: boolean;
}

export function EditModeProvider({ children, canEditSiteContent }: EditModeProviderProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const setEditMode = (value: boolean) => {
    setIsEditMode(canEditSiteContent ? value : false);
  };

  return (
    <EditModeContext.Provider
      value={{
        isEditMode: canEditSiteContent && isEditMode,
        setEditMode,
        canEditSiteContent,
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
}
