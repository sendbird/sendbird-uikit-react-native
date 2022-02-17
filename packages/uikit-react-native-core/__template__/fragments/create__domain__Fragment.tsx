//TODO: move to @sendbird/uikit-react-native/fragments
import React, { useContext } from 'react';
import { Text } from 'react-native';

// @ts-ignore - !!REMOVE
import type { __domain__Fragment, __domain__Module, __domain__Props } from '@sendbird/uikit-react-native-core';
// @ts-ignore - !!REMOVE
import { __domain__Context, create__domain__Module } from '@sendbird/uikit-react-native-core';
import { EmptyFunction } from '@sendbird/uikit-utils';

// @ts-ignore - !!REMOVE
import DefaultHeader from '../ui/Header';

const DefaultFragmentHeader: React.FC<{
  Header: __domain__Props['Fragment']['Header'];
  onPressHeaderLeft: __domain__Props['Fragment']['onPressHeaderLeft'];
}> = ({ Header, onPressHeaderLeft }) => {
  const { fragment } = useContext(__domain__Context);
  if (!Header) return null;
  return <Header title={fragment.headerTitle} left={<Text>{'LEFT'}</Text>} onPressLeft={onPressHeaderLeft} />;
};

const create__domain__Fragment = (initModule?: __domain__Module): __domain__Fragment => {
  const __domain__Module = create__domain__Module(initModule);

  return ({ Header = DefaultHeader, onPressHeaderLeft = EmptyFunction, children = null }) => {
    return (
      <__domain__Module.Provider>
        <DefaultFragmentHeader Header={Header} onPressHeaderLeft={onPressHeaderLeft} />
        <__domain__Module.View domainViewProp={'some-prop'} />
        {children}
      </__domain__Module.Provider>
    );
  };
};

export default create__domain__Fragment;
