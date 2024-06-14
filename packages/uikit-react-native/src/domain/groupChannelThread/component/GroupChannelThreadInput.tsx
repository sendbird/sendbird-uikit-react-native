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
    parentMessage,
  } = useContext(GroupChannelThreadContexts.Fragment);

  const chatAvailableState = getGroupChannelChatAvailableState(channel);

  return (
    <ChannelInput
      channel={channel}
      messageToEdit={messageToEdit}
      setMessageToEdit={setMessageToEdit}
      messageForThread={parentMessage}
      keyboardAvoidOffset={keyboardAvoidOffset}
      inputMuted={chatAvailableState.muted}
      inputFrozen={chatAvailableState.frozen}
      inputDisabled={inputDisabled ?? chatAvailableState.disabled}
      MessageToReplyPreview={() => {
        return null;
      }}
      {...props}
    />
  );
};

export default React.memo(GroupChannelThreadInput);
