// @ts-nocheck - !!REMOVE
import React from 'react';

import type { __domain__Fragment, __domain__Module } from '../domain/__template__/types';
import { create__domain__Module } from '../domain/__template__';
import { NOOP } from '@sendbird/uikit-utils';

const create__domain__Fragment = (initModule?: Partial<__domain__Module>): __domain__Fragment => {
  const __domain__Module = create__domain__Module(initModule);

  return ({ onPressHeaderLeft = NOOP, children }) => {
    // const { domainViewProps, loading } = use__domain__();

    // if (loading) return <__domain__Module.StatusLoading />;

    return (
      <__domain__Module.Provider>
        <__domain__Module.Header onPressHeaderLeft={onPressHeaderLeft} />
        <__domain__Module.View domainViewProp={'some-prop'} />
        {children}
      </__domain__Module.Provider>
    );
  };
};

export default create__domain__Fragment;
