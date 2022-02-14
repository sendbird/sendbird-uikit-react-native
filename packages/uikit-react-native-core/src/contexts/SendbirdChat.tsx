import React, { useContext, useMemo, useState } from 'react';
import Sendbird from 'sendbird';

import { Logger } from '@sendbird/uikit-utils';

type Props = {
  appId: string;
  localCacheEnabled?: boolean;
};

type Context = {
  sdk: Sendbird.SendBirdInstance;
  localCacheEnabled: boolean;
  currentUser?: Sendbird.User;
  setCurrentUser: React.Dispatch<React.SetStateAction<Sendbird.User | undefined>>;
};

export const SendbirdChatContext = React.createContext<Context | null>(null);
export const SendbirdChatProvider: React.FC<Props> = ({ children, appId, localCacheEnabled = false }) => {
  const [currentUser, setCurrentUser] = useState<Sendbird.User>();
  const sdk = useMemo(() => {
    const instance = new Sendbird({ appId, localCacheEnabled });
    if (localCacheEnabled) {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      if (AsyncStorage) instance.useAsyncStorageAsDatabase(AsyncStorage);
      else Logger.error('Please install `@react-native-async-storage/async-storage` for use local caching');
    }
    return instance;
  }, [appId, localCacheEnabled]);

  return (
    <SendbirdChatContext.Provider value={{ sdk, localCacheEnabled, currentUser, setCurrentUser }}>
      {children}
    </SendbirdChatContext.Provider>
  );
};

export const useSendbirdChat = () => {
  const value = useContext(SendbirdChatContext);
  if (!value) throw new Error('SendbirdChatContext is not provided');
  return value;
};
