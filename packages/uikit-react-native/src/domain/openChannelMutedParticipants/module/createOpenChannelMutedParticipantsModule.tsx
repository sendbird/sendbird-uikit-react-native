import OpenChannelMutedParticipantsHeader from '../component/OpenChannelMutedParticipantsHeader';
import OpenChannelMutedParticipantsList from '../component/OpenChannelMutedParticipantsList';
import OpenChannelMutedParticipantsStatusEmpty from '../component/OpenChannelMutedParticipantsStatusEmpty';
import OpenChannelMutedParticipantsStatusError from '../component/OpenChannelMutedParticipantsStatusError';
import OpenChannelMutedParticipantsStatusLoading from '../component/OpenChannelMutedParticipantsStatusLoading';
import type { OpenChannelMutedParticipantsModule } from '../types';
import { OpenChannelMutedParticipantsContextsProvider } from './moduleContext';

const createOpenChannelMutedParticipantsModule = ({
  Header = OpenChannelMutedParticipantsHeader,
  List = OpenChannelMutedParticipantsList,
  StatusLoading = OpenChannelMutedParticipantsStatusLoading,
  StatusEmpty = OpenChannelMutedParticipantsStatusEmpty,
  StatusError = OpenChannelMutedParticipantsStatusError,
  Provider = OpenChannelMutedParticipantsContextsProvider,
  ...module
}: Partial<OpenChannelMutedParticipantsModule> = {}): OpenChannelMutedParticipantsModule => {
  return { Header, List, Provider, StatusEmpty, StatusLoading, StatusError, ...module };
};

export default createOpenChannelMutedParticipantsModule;
