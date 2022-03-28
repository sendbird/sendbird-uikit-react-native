import React from 'react';
import type Sendbird from 'sendbird';

import type { MessageRendererInterface } from '../index';
import BaseUserMessage from './BaseUserMessage';
import OpenGraphUserMessage from './OpenGraphUserMessage';

export type UserMessageProps = MessageRendererInterface<Sendbird.UserMessage>;
const UserMessage: React.FC<UserMessageProps> = (props) => {
  if (props.message.ogMetaData) {
    return <OpenGraphUserMessage {...props} ogMetaData={props.message.ogMetaData} />;
  }
  return <BaseUserMessage {...props} />;
};

export default React.memo(UserMessage);
