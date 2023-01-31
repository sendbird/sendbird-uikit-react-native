import type React from 'react';

import type { SendbirdFileMessage, SendbirdOpenChannel, SendbirdUserMessage } from '@sendbird/uikit-utils';

import type { ChannelInputProps } from '../../components/ChannelInput';
import type { CommonComponent } from '../../types';

export type OpenChannelProps = {
  Fragment: {
    onPressHeaderLeft: OpenChannelProps['Header']['onPressHeaderLeft'];
  };
  Header: {
    onPressHeaderLeft: () => void;
  };
  Input: Pick<
    ChannelInputProps,
    | 'shouldRenderInput'
    | 'onSendFileMessage'
    | 'onSendUserMessage'
    | 'onUpdateFileMessage'
    | 'onUpdateUserMessage'
    | 'SuggestedMentionList'
  >;

  Provider: {
    channel: SendbirdOpenChannel;
    keyboardAvoidOffset?: number;
  };
};

/**
 * Internal context for OpenChannel
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type OpenChannelContextsType = {
  Fragment: React.Context<{
    headerTitle: string;
    channel: SendbirdOpenChannel;
    messageToEdit?: SendbirdUserMessage | SendbirdFileMessage;
    setMessageToEdit: (msg?: SendbirdUserMessage | SendbirdFileMessage) => void;
    keyboardAvoidOffset?: number;
  }>;
};
export interface OpenChannelModule {
  Provider: CommonComponent<OpenChannelProps['Provider']>;
  Header: CommonComponent<OpenChannelProps['Header']>;
  Input: CommonComponent<OpenChannelProps['Input']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
}

export type OpenChannelFragment = CommonComponent<OpenChannelProps['Fragment']>;
