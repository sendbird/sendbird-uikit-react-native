import React from 'react';

import create__domain__Module from '../module/create__domain__Module';
import type { __domain__Fragment, __domain__Module } from '../types';

const create__domain__Fragment = (initModule?: __domain__Module): __domain__Fragment => {
  const module = create__domain__Module(initModule);

  const __domain__Fragment: __domain__Fragment = ({ left = () => null, right = () => null, title = 'title' }) => {
    return (
      <>
        {module.Header({ left, right, title })}
        {module.View({})}
      </>
    );
  };

  __domain__Fragment.Header = module.Header;
  __domain__Fragment.View = module.View;

  return __domain__Fragment;
};

export default create__domain__Fragment;
