
const useHooksForChat = () => ({ dataA: '', dataB: '' });

/**
 * Key functions
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/overview}
 * */
import React, { createContext, useContext } from 'react';
import { Text } from 'react-native';

const KeyFunctionContext = {
  Fragment: createContext<{ dataA?: string }>({}),
};

const KeyFunctionModule = {
  Provider: ({ dataA, children }: { dataA?: string; children: React.ReactNode }) => {
    return <KeyFunctionContext.Fragment.Provider value={{ dataA }}>{children}</KeyFunctionContext.Fragment.Provider>;
  },
  Component: ({ dataB }: { dataB: string }) => {
    const { dataA } = useContext(KeyFunctionContext.Fragment);
    return (
      <Text>
        {dataA} / {dataB}
      </Text>
    );
  },
};

const KeyFunctionFragment = () => {
  const { dataA, dataB } = useHooksForChat();
  return (
    <KeyFunctionModule.Provider dataA={dataA}>
      <KeyFunctionModule.Component dataB={dataB} />
    </KeyFunctionModule.Provider>
  );
};
/** ------------------ **/
