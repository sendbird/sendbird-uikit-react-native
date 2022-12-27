import React from 'react';

import type { SendbirdUserMessage } from '@sendbird/uikit-utils';

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
  if (props.message.ogMetaData) {
    return <OpenGraphUserMessage {...props} ogMetaData={props.message.ogMetaData} />;
  }
  return <BaseUserMessage {...props} />;
};

export default React.memo(UserMessage);
