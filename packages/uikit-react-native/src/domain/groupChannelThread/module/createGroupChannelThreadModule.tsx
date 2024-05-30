import GroupChannelThreadHeader from '../component/GroupChannelThreadHeader';
import GroupChannelThreadInput from '../component/GroupChannelThreadInput';
import GroupChannelThreadMessageList from '../component/GroupChannelThreadMessageList';
import GroupChannelThreadParentMessageInfo from '../component/GroupChannelThreadParentMessageInfo';
import GroupChannelThreadStatusEmpty from '../component/GroupChannelThreadStatusEmpty';
import GroupChannelThreadStatusLoading from '../component/GroupChannelThreadStatusLoading';
import GroupChannelThreadSuggestedMentionList from '../component/GroupChannelThreadSuggestedMentionList';
import type { GroupChannelThreadModule } from '../types';
import { GroupChannelThreadContextsProvider } from './moduleContext';

const createGroupChannelThreadModule = ({
  Header = GroupChannelThreadHeader,
  ParentMessageInfo = GroupChannelThreadParentMessageInfo,
  MessageList = GroupChannelThreadMessageList,
  Input = GroupChannelThreadInput,
  SuggestedMentionList = GroupChannelThreadSuggestedMentionList,
  StatusLoading = GroupChannelThreadStatusLoading,
  StatusEmpty = GroupChannelThreadStatusEmpty,
  Provider = GroupChannelThreadContextsProvider,
  ...module
}: Partial<GroupChannelThreadModule> = {}): GroupChannelThreadModule => {
  return {
    Header,
    ParentMessageInfo,
    MessageList,
    Input,
    SuggestedMentionList,
    StatusEmpty,
    StatusLoading,
    Provider,
    ...module,
  };
};

export default createGroupChannelThreadModule;
