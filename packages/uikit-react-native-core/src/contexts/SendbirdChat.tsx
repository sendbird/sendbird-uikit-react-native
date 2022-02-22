import React, { useContext, useState } from 'react';
import type Sendbird from 'sendbird';

type Props = {
  sdkInstance: Sendbird.SendBirdInstance;
};

type Context = {
  sdk: Sendbird.SendBirdInstance;
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
