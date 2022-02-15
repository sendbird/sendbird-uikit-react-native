//TODO: move to @sendbird/uikit-react-native/fragments
import React, { useContext } from 'react';
import { Pressable, Text } from 'react-native';

// @ts-ignore - !!REMOVE
import type { __domain__Fragment, __domain__HeaderProps, __domain__Module } from '@sendbird/uikit-react-native-core';
// @ts-ignore - !!REMOVE
import { create__domain__Module } from '@sendbird/uikit-react-native-core';

// @ts-ignore - !!REMOVE
import DefaultHeader from '../ui/Header';

const create__domain__Fragment = (initModule?: __domain__Module): __domain__Fragment => {
  const __domain__Module = create__domain__Module(initModule);

  return ({ Header = DefaultHeader }) => {
    // const fragmentHook  = use__domain__();
    return (
      <__domain__Module.Provider>
        <__domain__FragmentHeader Header={Header} Context={__domain__Module.Context} />
        {__domain__Module.View({})}
      </__domain__Module.Provider>
    );
  };
};

const __domain__FragmentHeader: React.FC<__domain__HeaderProps> = ({ Header, Context, onPressHeaderLeft }) => {
  // const { LABEL } = useLocalization();
  const {} = useContext(Context);
  if (!Header) return null;
  return (
    <Header
      title={'LABEL.__domain__.HEADER_TITLE'}
      left={
        <Pressable onPress={onPressHeaderLeft}>
          <Text>{'LEFT'}</Text>
        </Pressable>
      }
    />
  );
};

export default create__domain__Fragment;
