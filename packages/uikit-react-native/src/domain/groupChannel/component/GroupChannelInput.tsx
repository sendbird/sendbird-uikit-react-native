import React, { useContext } from 'react';

import { getGroupChannelChatAvailableState } from '@sendbird/uikit-utils';

import ChannelInput from '../../../components/ChannelInput';
import { GroupChannelContexts } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const GroupChannelInput = ({ inputDisabled, ...props }: GroupChannelProps['Input']) => {
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
      keyboardAvoidOffset={keyboardAvoidOffset}
      inputMuted={chatAvailableState.muted}
      inputFrozen={chatAvailableState.frozen}
      inputDisabled={inputDisabled ?? chatAvailableState.disabled}
      {...props}
    />
  );
};

export default React.memo(GroupChannelInput);
