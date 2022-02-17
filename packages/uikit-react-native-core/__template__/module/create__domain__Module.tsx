import __domain__View from '../component/__domain__View';
import type { __domain__Module } from '../types';
import { __domain__ContextProvider } from './moduleContext';

const create__domain__Module = ({
  View = __domain__View,
  Provider = __domain__ContextProvider,
  ...module
}: Partial<__domain__Module> = {}): __domain__Module => {
  return { View, Provider, ...module };
};

export default create__domain__Module;
