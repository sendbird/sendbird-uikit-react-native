// @ts-nocheck - !!REMOVE
//TODO: move to @sendbird/uikit-react-native/fragments
import React from 'react';

import type { __domain__Fragment, __domain__Module } from '@sendbird/uikit-react-native-core';
import { EmptyFunction } from '@sendbird/uikit-utils';

import create__domain__Module from '../module/create__domain__Module';

const create__domain__Fragment = (initModule?: __domain__Module): __domain__Fragment => {
  const __domain__Module = create__domain__Module(initModule);

  return ({ Header, onPressHeaderLeft = EmptyFunction, children }) => {
    // const { domainViewProps } = use__domain__();

    return (
      <__domain__Module.Provider>
        <__domain__Module.Header Header={Header} onPressHeaderLeft={onPressHeaderLeft} />
        <__domain__Module.View domainViewProp={'some-prop'} />
        {children}
      </__domain__Module.Provider>
    );
  };
};

export default create__domain__Fragment;
