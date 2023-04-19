import React, { useContext } from 'react';

import ChannelMessageList from '../../../components/ChannelMessageList';
import { GroupChannelContexts } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const GroupChannelMessageList = (props: GroupChannelProps['MessageList']) => {
  const { setMessageToEdit } = useContext(GroupChannelContexts.Fragment);
  return <ChannelMessageList {...props} onEditMessage={setMessageToEdit} />;
};

export default React.memo(GroupChannelMessageList);
