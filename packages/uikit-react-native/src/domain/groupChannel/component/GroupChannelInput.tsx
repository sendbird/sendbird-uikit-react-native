import React, { useContext } from 'react';

import { getGroupChannelChatAvailableState } from '@sendbird/uikit-utils';

import ChannelInput from '../../../components/ChannelInput';
import { GroupChannelContexts } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const GroupChannelInput = (props: GroupChannelProps['Input']) => {
  const {
    channel,
    messageToEdit,
    setMessageToEdit,
    keyboardAvoidOffset = 0,
  } = useContext(GroupChannelContexts.Fragment);

  const chatAvailableState = getGroupChannelChatAvailableState(channel);

  return (
    <ChannelInput
      channel={channel}
      messageToEdit={messageToEdit}
      setMessageToEdit={setMessageToEdit}
      inputMuted={chatAvailableState.muted}
      inputFrozen={chatAvailableState.frozen}
      inputDisabled={chatAvailableState.disabled}
      keyboardAvoidOffset={keyboardAvoidOffset}
      {...props}
    />
  );
};

export default React.memo(GroupChannelInput);
