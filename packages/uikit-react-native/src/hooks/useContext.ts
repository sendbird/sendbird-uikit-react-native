import { useContext } from 'react';

import { LocalizationContext } from '../contexts/LocalizationCtx';
import { PlatformServiceContext } from '../contexts/PlatformServiceCtx';
import { ReactionContext } from '../contexts/ReactionCtx';
import { SendbirdChatContext } from '../contexts/SendbirdChatCtx';
import { UserProfileContext } from '../contexts/UserProfileCtx';

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

export const useUserProfile = () => {
  const value = useContext(UserProfileContext);
  if (!value) throw new Error('UserProfileContext is not provided');
  return value;
};

export const useReaction = () => {
  const value = useContext(ReactionContext);
  if (!value) throw new Error('ReactionContext is not provided');
  return value;
};
