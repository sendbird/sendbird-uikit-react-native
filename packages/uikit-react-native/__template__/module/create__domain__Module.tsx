import __domain__Header from '../component/__domain__Header';
import __domain__StatusEmpty from '../component/__domain__StatusEmpty';
import __domain__StatusLoading from '../component/__domain__StatusLoading';
import __domain__View from '../component/__domain__View';
import type { __domain__Module } from '../types';
import { __domain__ContextsProvider } from './moduleContext';

const create__domain__Module = ({
  Header = __domain__Header,
  View = __domain__View,
  StatusLoading = __domain__StatusLoading,
  StatusEmpty = __domain__StatusEmpty,
  Provider = __domain__ContextsProvider,
  ...module
}: Partial<__domain__Module> = {}): __domain__Module => {
  return { Header, View, Provider, StatusEmpty, StatusLoading, ...module };
};

export default create__domain__Module;
