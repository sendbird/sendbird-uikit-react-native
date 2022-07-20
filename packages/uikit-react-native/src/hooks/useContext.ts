import React, { useContext } from 'react';

import { LocalizationContext, LocalizationContextType } from '../contexts/Localization';
import { PlatformServiceContext } from '../contexts/PlatformService';
import { SendbirdChatContext } from '../contexts/SendbirdChat';

export const useLocalization = () => {
  const value = useContext<LocalizationContextType | null>(
    LocalizationContext as React.Context<LocalizationContextType | null>,
  );
  if (!value) throw new Error('LocalizationContext is not provided');
  return value;
};

export const usePlatformService = () => {
  const value = useContext(PlatformServiceContext);
  if (!value) throw new Error('PlatformServiceContext is not provided');
  return value;
};

export const useSendbirdChat = () => {
  const value = useContext(SendbirdChatContext);
  if (!value) throw new Error('SendbirdChatContext is not provided');
  return value;
};
