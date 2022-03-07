import React, { useCallback, useContext, useState } from 'react';
import type Sendbird from 'sendbird';

import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { useForceUpdate } from '@sendbird/uikit-utils';

type Props = {
  sdkInstance: SendbirdChatSDK;
};

type Context = {
  sdk: SendbirdChatSDK;
  currentUser?: Sendbird.User;
  setCurrentUser: React.Dispatch<React.SetStateAction<Sendbird.User | undefined>>;
};

export const SendbirdChatContext = React.createContext<Context | null>(null);
export const SendbirdChatProvider: React.FC<Props> = ({ children, sdkInstance }) => {
  const [currentUser, setCurrentUser] = useState<Sendbird.User>();
  // NOTE: Inside sdk, the user is always managed as the same object.
  const forceUpdate = useForceUpdate();
  const updateCurrentUser: Context['setCurrentUser'] = useCallback((user) => {
    setCurrentUser(user);
    forceUpdate();
  }, []);

  return (
    <SendbirdChatContext.Provider value={{ sdk: sdkInstance, currentUser, setCurrentUser: updateCurrentUser }}>
      {children}
    </SendbirdChatContext.Provider>
  );
};

export const useSendbirdChat = () => {
  const value = useContext(SendbirdChatContext);
  if (!value) throw new Error('SendbirdChatContext is not provided');
  return value;
};
