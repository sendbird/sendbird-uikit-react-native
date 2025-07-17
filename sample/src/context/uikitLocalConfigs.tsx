import React, { createContext, useState } from 'react';

import { uikitLocalConfigStorage } from '../factory/mmkv';

const KEY = 'uikitOptions';
const defaultOptions = {
  rtl: false,
  replyType: 'quote_reply' as 'none' | 'thread' | 'quote_reply',
  threadReplySelectType: 'parent' as 'thread' | 'parent',
};

type ContextValue = typeof defaultOptions;

export const UIKitLocalConfigsContext = createContext<{
  localConfigs: ContextValue;
  setLocalConfigs: React.Dispatch<React.SetStateAction<ContextValue>>;
}>({
  localConfigs: defaultOptions,
  setLocalConfigs: () => {},
});

export const UIKitLocalConfigsProvider = ({ children }: React.PropsWithChildren) => {
  const [state, setState] = useState<ContextValue>(() => {
    const data = uikitLocalConfigStorage.getString(KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return defaultOptions;
      }
    } else {
      return defaultOptions;
    }
  });

  return (
    <UIKitLocalConfigsContext.Provider
      value={{
        localConfigs: state,
        setLocalConfigs: (value) => {
          setState((prev) => {
            const next = typeof value === 'function' ? value(prev) : value;
            uikitLocalConfigStorage.set(KEY, JSON.stringify(next));
            return next;
          });
        },
      }}
    >
      {children}
    </UIKitLocalConfigsContext.Provider>
  );
};

export const withUIKitLocalConfigs = (Component: React.ComponentType<object>) => {
  return (props: object) => (
    <UIKitLocalConfigsProvider>
      <Component {...props} />
    </UIKitLocalConfigsProvider>
  );
};
