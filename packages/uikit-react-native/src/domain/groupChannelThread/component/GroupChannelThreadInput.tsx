import React, { useContext } from 'react';

import { getGroupChannelChatAvailableState } from '@sendbird/uikit-utils';

import ChannelInput from '../../../components/ChannelInput';
import { GroupChannelThreadContexts } from '../module/moduleContext';
import type { GroupChannelThreadProps } from '../types';

const GroupChannelThreadInput = ({ inputDisabled, ...props }: GroupChannelThreadProps['Input']) => {
  const {
    channel,
    keyboardAvoidOffset = 0,
    messageToEdit,
    setMessageToEdit,
    messageToReply,
    setMessageToReply,
  } = useContext(GroupChannelThreadContexts.Fragment);

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

export default React.memo(GroupChannelThreadInput);
