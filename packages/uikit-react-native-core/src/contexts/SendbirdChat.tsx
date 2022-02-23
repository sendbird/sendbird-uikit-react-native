import React, { useContext, useState } from 'react';
import type Sendbird from 'sendbird';

import type { SendbirdChatSDK } from '@sendbird/uikit-utils';

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

  return (
    <SendbirdChatContext.Provider value={{ sdk: sdkInstance, currentUser, setCurrentUser }}>
      {children}
    </SendbirdChatContext.Provider>
  );
};

export const useSendbirdChat = () => {
  const value = useContext(SendbirdChatContext);
  if (!value) throw new Error('SendbirdChatContext is not provided');
  return value;
};
