import __domain__Header from '../component/__domain__Header';
import __domain__View from '../component/__domain__View';
import type { __domain__Module } from '../types';

const create__domain__Module = (module?: Partial<__domain__Module>): __domain__Module => {
  const { Header = __domain__Header, View = __domain__View } = module ?? {};
  return { ...module, Header, View };
};

export default create__domain__Module;
