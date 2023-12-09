import React from "react";
import type { TemplateConfig } from "./withTemplateConfig";

const TemplateConfigContext = React.createContext<TemplateConfig>({});

interface TemplateConfigProviderProps {
  children: React.ReactNode;
  value: TemplateConfig;
}
export function TemplateConfigProvider({ value, children }: TemplateConfigProviderProps) {
  return (
    <TemplateConfigContext.Provider value={value}>
      {children}
    </TemplateConfigContext.Provider>
  );
}


export const useTemplateConfig = () => React.useContext(TemplateConfigContext);
