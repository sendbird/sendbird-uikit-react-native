import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import type Sendbird from 'sendbird';

import { useAppFeatures } from '@sendbird/uikit-chat-hooks';
import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { useForceUpdate } from '@sendbird/uikit-utils';

type Props = {
  sdkInstance: SendbirdChatSDK;

  enableAutoPushTokenRegistration: boolean;
  // enableChannelListTypingIndicator: boolean;
  // enableChannelListMessageReceiptStatus: boolean;
};

type Context = {
  sdk: SendbirdChatSDK;
  currentUser?: Sendbird.User;
  setCurrentUser: React.Dispatch<React.SetStateAction<Sendbird.User | undefined>>;

  // UIKit features
  enableAutoPushTokenRegistration: boolean;
  // enableChannelListTypingIndicator: boolean;
  // enableChannelListMessageReceiptState: boolean;

  // Sendbird application features
  deliveryReceiptEnabled: boolean;
  broadcastChannelEnabled: boolean;
  superGroupChannelEnabled: boolean;
  reactionEnabled: boolean;
};

export const SendbirdChatContext = React.createContext<Context | null>(null);
export const SendbirdChatProvider: React.FC<Props> = ({ children, sdkInstance, enableAutoPushTokenRegistration }) => {
  const [currentUser, _setCurrentUser] = useState<Sendbird.User>();
  const forceUpdate = useForceUpdate();
  const setCurrentUser: Context['setCurrentUser'] = useCallback((user) => {
    // NOTE: Sendbird SDK handle User object is always same object, so force update after setCurrentUser
    _setCurrentUser(user);
    forceUpdate();
  }, []);

  // FIXME: MessageCollection cannot sync messages when returning from the background to foreground.
  useEffect(() => {
    const listener = (status: AppStateStatus) => {
      // 'active' | 'background' | 'inactive' | 'unknown' | 'extension';
      if (status === 'active') sdkInstance.getConnectionState() === 'CLOSED' && sdkInstance.setForegroundState();
      else sdkInstance.getConnectionState() === 'OPEN' && sdkInstance.setBackgroundState();
    };
    listener(AppState.currentState);
    const subscriber = AppState.addEventListener('change', listener);
    return () => subscriber.remove();
  }, [sdkInstance]);

  const appFeatures = useAppFeatures(sdkInstance);

  const value: Context = {
    sdk: sdkInstance,
    currentUser,
    setCurrentUser,
    enableAutoPushTokenRegistration,
    ...appFeatures,
  };

  return <SendbirdChatContext.Provider value={value}>{children}</SendbirdChatContext.Provider>;
};

export const useSendbirdChat = () => {
  const value = useContext(SendbirdChatContext);
  if (!value) throw new Error('SendbirdChatContext is not provided');
  return value;
};
