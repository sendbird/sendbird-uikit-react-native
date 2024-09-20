import React from 'react';

export interface SBUHandlers {
  onOpenURL: (url: string) => void;
  onOpenFileURL: (url: string) => void;
}

type Props = React.PropsWithChildren<SBUHandlers>;

export type SBUHandlersContextType = SBUHandlers;

export const SBUHandlersContext = React.createContext<SBUHandlersContextType | null>(null);
export const SBUHandlersProvider = ({ children, onOpenURL, onOpenFileURL }: Props) => {
  return <SBUHandlersContext.Provider value={{ onOpenURL, onOpenFileURL }}>{children}</SBUHandlersContext.Provider>;
};
