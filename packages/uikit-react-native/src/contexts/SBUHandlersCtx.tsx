import React from 'react';

export interface SBUHandlers {
  /**
   * Callback function to handle opening a URL.
   * This is triggered when a URL needs to be opened.
   */
  onOpenURL: (url: string) => void;

  /**
   * Callback function to handle opening a file URL.
   * This is triggered when a file URL needs to be opened.
   *
   * Note that this function is also called redundantly
   * when `onPressMediaMessage` handler is triggered by clicking on media messages containing images, videos, or audio.
   */
  onOpenFileURL?: (url: string) => void;
}

type Props = React.PropsWithChildren<SBUHandlers>;

export type SBUHandlersContextType = SBUHandlers;

export const SBUHandlersContext = React.createContext<SBUHandlersContextType | null>(null);
export const SBUHandlersProvider = ({ children, onOpenURL, onOpenFileURL }: Props) => {
  return <SBUHandlersContext.Provider value={{ onOpenURL, onOpenFileURL }}>{children}</SBUHandlersContext.Provider>;
};
