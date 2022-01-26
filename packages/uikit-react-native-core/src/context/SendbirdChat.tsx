import React, { useContext, useMemo } from 'react';
import Sendbird from 'sendbird';

type Props = {
  appId: string;
  localCacheEnabled?: boolean;

  userId: string | null;
  accessToken?: string;
};

type Context = {
  sdk: Sendbird.SendBirdInstance;
  localCacheEnabled: boolean;
  userId: string | null;
  accessToken?: string;
};

export const SendbirdChatContext = React.createContext<Context | null>(null);
export const SendbirdChatProvider: React.FC<Props> = ({
  children,
  appId,
  localCacheEnabled = false,
  userId,
  accessToken,
}) => {
  const sdk = useMemo(() => {
    const instance = new Sendbird({ appId, localCacheEnabled });
    if (localCacheEnabled) instance.useAsyncStorageAsDatabase(require('@react-native-async-storage/async-storage'));
    return instance;
  }, [appId, localCacheEnabled]);

  return (
    <SendbirdChatContext.Provider value={{ sdk, localCacheEnabled, userId, accessToken }}>
      {children}
    </SendbirdChatContext.Provider>
  );
};

export const useSendbirdChat = () => {
  const value = useContext(SendbirdChatContext);
  if (!value) throw new Error('SendbirdChatContext is not provided');
  return value;
};
