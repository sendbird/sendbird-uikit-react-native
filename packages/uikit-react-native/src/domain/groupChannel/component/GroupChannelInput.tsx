import React, { useContext } from 'react';

import { getGroupChannelChatAvailableState } from '@gathertown/uikit-utils';

import ChannelInput from '../../../components/ChannelInput';
import { GroupChannelContexts } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const GroupChannelInput = (props: GroupChannelProps['Input']) => {
  const {
    channel,
    keyboardAvoidOffset = 0,
    messageToEdit,
    setMessageToEdit,
    messageToReply,
    setMessageToReply,
  } = useContext(GroupChannelContexts.Fragment);

  const chatAvailableState = getGroupChannelChatAvailableState(channel);

  return (
    <ChannelInput
      channel={channel}
      messageToEdit={messageToEdit}
      setMessageToEdit={setMessageToEdit}
      messageToReply={messageToReply}
      setMessageToReply={setMessageToReply}
      inputMuted={chatAvailableState.muted}
      inputFrozen={chatAvailableState.frozen}
      inputDisabled={chatAvailableState.disabled}
      keyboardAvoidOffset={keyboardAvoidOffset}
      {...props}
    />
  );
};

export default React.memo(GroupChannelInput);
