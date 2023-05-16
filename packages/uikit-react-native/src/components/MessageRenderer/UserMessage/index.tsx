import React from 'react';

import type { SendbirdUserMessage } from '@sendbird/uikit-utils';

import { useSendbirdChat } from '../../../hooks/useContext';
import type { MessageRendererInterface } from '../index';
import BaseUserMessage from './BaseUserMessage';
import OpenGraphUserMessage from './OpenGraphUserMessage';

export type UserMessageProps = MessageRendererInterface<
  SendbirdUserMessage,
  {
    onLongPressMentionedUser?: () => void;
    onLongPressURL?: () => void;
  }
>;

const UserMessage = (props: UserMessageProps) => {
  const { features } = useSendbirdChat();
  if (props.message.ogMetaData && features.groupChannelOGTagEnabled) {
    return <OpenGraphUserMessage {...props} ogMetaData={props.message.ogMetaData} />;
  }
  return <BaseUserMessage {...props} />;
};

export default React.memo(UserMessage);
