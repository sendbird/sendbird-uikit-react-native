import MessageSearchHeader from '../component/MessageSearchHeader';
import MessageSearchList from '../component/MessageSearchList';
import MessageSearchStatusEmpty from '../component/MessageSearchStatusEmpty';
import MessageSearchStatusError from '../component/MessageSearchStatusError';
import MessageSearchStatusLoading from '../component/MessageSearchStatusLoading';
import type { MessageSearchModule } from '../types';
import { MessageSearchContextsProvider } from './moduleContext';

const createMessageSearchModule = ({
  Header = MessageSearchHeader,
  List = MessageSearchList,
  StatusError = MessageSearchStatusError,
  StatusLoading = MessageSearchStatusLoading,
  StatusEmpty = MessageSearchStatusEmpty,
  Provider = MessageSearchContextsProvider,
  ...module
}: Partial<MessageSearchModule> = {}): MessageSearchModule => {
  return { Header, List, Provider, StatusError, StatusEmpty, StatusLoading, ...module };
};

export default createMessageSearchModule;
