import { useContext } from 'react';

import { LocalizationContext } from '../contexts/LocalizationCtx';
import { PlatformServiceContext } from '../contexts/PlatformServiceCtx';
import { ProfileCardContext } from '../contexts/ProfileCardCtx';
import { SendbirdChatContext } from '../contexts/SendbirdChatCtx';

export const useLocalization = () => {
  const value = useContext(LocalizationContext);
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

export const useProfileCard = () => {
  const value = useContext(ProfileCardContext);
  if (!value) throw new Error('ProfileCardContext is not provided');
  return value;
};
