import React, { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useAppFeatures } from '@sendbird/uikit-chat-hooks';
import type { SendbirdChatSDK, SendbirdGroupChannel, SendbirdUser } from '@sendbird/uikit-utils';
import { useForceUpdate } from '@sendbird/uikit-utils';

import type { FileType } from '../platform/types';

type Props = React.PropsWithChildren<{
  sdkInstance: SendbirdChatSDK;

  enableAutoPushTokenRegistration: boolean;
  // enableChannelListTypingIndicator: boolean;
  // enableChannelListMessageReceiptStatus: boolean;
}>;

type Context = {
  sdk: SendbirdChatSDK;
  currentUser?: SendbirdUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<SendbirdUser | undefined>>;

  // helper functions
  updateCurrentUserInfo: (nickname: string, profile?: string | FileType) => Promise<SendbirdUser>;
  markAsDeliveredWithChannel: (channel: SendbirdGroupChannel) => void;

  features: {
    // UIKit features
    autoPushTokenRegistrationEnabled: boolean;
    // channelListTypingIndicatorEnabled: boolean;
    // channelListMessageReceiptStateEnabled: boolean;

    // Sendbird application features
    deliveryReceiptEnabled: boolean;
    broadcastChannelEnabled: boolean;
    superGroupChannelEnabled: boolean;
    reactionEnabled: boolean;
  };
};

export const SendbirdChatContext = React.createContext<Context | null>(null);
export const SendbirdChatProvider = ({ children, sdkInstance, enableAutoPushTokenRegistration }: Props) => {
  const [currentUser, _setCurrentUser] = useState<SendbirdUser>();
  const forceUpdate = useForceUpdate();
  const appFeatures = useAppFeatures(sdkInstance);

  const setCurrentUser: Context['setCurrentUser'] = useCallback((user) => {
    // NOTE: Sendbird SDK handle User object is always same object, so force update after setCurrentUser
    _setCurrentUser(user);
    forceUpdate();
  }, []);

  const updateCurrentUserInfo: Context['updateCurrentUserInfo'] = useCallback(
    async (nickname, profile) => {
      let user = currentUser;

      if (!user) throw new Error('Current user is not defined, please connect using `useConnection()` hook first');

      if (typeof profile === 'undefined') {
        user = await sdkInstance.updateCurrentUserInfo(nickname, sdkInstance.currentUser.profileUrl);
      } else if (typeof profile === 'string') {
        user = await sdkInstance.updateCurrentUserInfo(nickname, profile);
      } else if (typeof profile === 'object') {
        user = await sdkInstance.updateCurrentUserInfoWithProfileImage(nickname, profile);
      } else {
        throw new Error(`Cannot update profile, not supported profile type(${typeof profile})`);
      }

      setCurrentUser(user);
      return user;
    },
    [sdkInstance, currentUser, setCurrentUser],
  );

  const markAsDeliveredWithChannel: Context['markAsDeliveredWithChannel'] = useCallback(
    (channel: SendbirdGroupChannel) => {
      if (appFeatures.deliveryReceiptEnabled && channel.unreadMessageCount > 0) {
        sdkInstance.markAsDelivered(channel.url);
      }
    },
    [sdkInstance, appFeatures.deliveryReceiptEnabled],
  );

  useEffect(() => {
    const listener = (status: AppStateStatus) => {
      // 'active' | 'background' | 'inactive' | 'unknown' | 'extension';
      if (status === 'active') sdkInstance.getConnectionState() === 'CLOSED' && sdkInstance.setForegroundState();
      else sdkInstance.getConnectionState() === 'OPEN' && sdkInstance.setBackgroundState();
    };

    const subscriber = AppState.addEventListener('change', listener);
    return () => subscriber.remove();
  }, [sdkInstance]);

  const value: Context = {
    sdk: sdkInstance,
    currentUser,
    setCurrentUser,

    updateCurrentUserInfo,
    markAsDeliveredWithChannel,

    features: {
      ...appFeatures,
      autoPushTokenRegistrationEnabled: enableAutoPushTokenRegistration,
    },
  };

  return <SendbirdChatContext.Provider value={value}>{children}</SendbirdChatContext.Provider>;
};
