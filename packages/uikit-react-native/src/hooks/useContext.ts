import React, { useContext } from 'react';

import { LocalizationContext, LocalizationContextType } from '../contexts/Localization';
import { PlatformServiceContext } from '../contexts/PlatformService';
import { SendbirdChatContext } from '../contexts/SendbirdChat';
import type { StringsLocale } from '../localization/StringSet.type';

export const useLocalization = <T extends string = StringsLocale['locale']>() => {
  const value = useContext<LocalizationContextType<T> | null>(
    LocalizationContext as React.Context<LocalizationContextType<T> | null>,
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
