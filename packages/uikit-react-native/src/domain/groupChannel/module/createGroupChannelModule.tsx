import GroupChannelHeader from '../component/GroupChannelHeader';
import GroupChannelInput from '../component/GroupChannelInput';
import GroupChannelMessageList from '../component/GroupChannelMessageList';
import GroupChannelStatusEmpty from '../component/GroupChannelStatusEmpty';
import GroupChannelStatusLoading from '../component/GroupChannelStatusLoading';
import GroupChannelSuggestedMentionList from '../component/GroupChannelSuggestedMentionList';
import type { GroupChannelModule } from '../types';
import { GroupChannelContextsProvider } from './moduleContext';

const createGroupChannelModule = ({
  Header = GroupChannelHeader,
  MessageList = GroupChannelMessageList,
  Input = GroupChannelInput,
  SuggestedMentionList = GroupChannelSuggestedMentionList,
  StatusLoading = GroupChannelStatusLoading,
  StatusEmpty = GroupChannelStatusEmpty,
  Provider = GroupChannelContextsProvider,
  ...module
}: Partial<GroupChannelModule> = {}): GroupChannelModule => {
  return {
    Header,
    MessageList,
    Input,
    SuggestedMentionList,
    StatusEmpty,
    StatusLoading,
    Provider,
    ...module,
  };
};

export default createGroupChannelModule;
