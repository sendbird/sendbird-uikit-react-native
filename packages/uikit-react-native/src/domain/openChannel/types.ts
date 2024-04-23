import type React from 'react';

import type { UseOpenChannelMessagesOptions } from '@sendbird/uikit-chat-hooks';
import type { Icon } from '@sendbird/uikit-react-native-foundation';
import type {
  OnBeforeHandler,
  PickPartial,
  SendbirdFileMessage,
  SendbirdFileMessageCreateParams,
  SendbirdFileMessageUpdateParams,
  SendbirdMessage,
  SendbirdOpenChannel,
  SendbirdUserMessage,
  SendbirdUserMessageCreateParams,
  SendbirdUserMessageUpdateParams,
} from '@sendbird/uikit-utils';

import type { ChannelInputProps } from '../../components/ChannelInput';
import type { ChannelMessageListProps } from '../../components/ChannelMessageList';
import type { CommonComponent } from '../../types';
import type { PubSub } from '../../utils/pubsub';

export type OpenChannelProps = {
  Fragment: {
    channel: SendbirdOpenChannel;
    onChannelDeleted: () => void;
    onPressHeaderLeft: OpenChannelProps['Header']['onPressHeaderLeft'];
    onPressHeaderRightWithSettings: OpenChannelProps['Header']['onPressHeaderRight'];
    onPressHeaderRightWithParticipants: OpenChannelProps['Header']['onPressHeaderRight'];
    onPressMediaMessage?: OpenChannelProps['MessageList']['onPressMediaMessage'];

    onBeforeSendUserMessage?: OnBeforeHandler<SendbirdUserMessageCreateParams>;
    onBeforeSendFileMessage?: OnBeforeHandler<SendbirdFileMessageCreateParams>;
    onBeforeUpdateUserMessage?: OnBeforeHandler<SendbirdUserMessageUpdateParams>;
    onBeforeUpdateFileMessage?: OnBeforeHandler<SendbirdFileMessageUpdateParams>;

    renderMessage?: OpenChannelProps['MessageList']['renderMessage'];
    renderNewMessagesButton?: OpenChannelProps['MessageList']['renderNewMessagesButton'];
    renderScrollToBottomButton?: OpenChannelProps['MessageList']['renderScrollToBottomButton'];

    enableMessageGrouping?: OpenChannelProps['MessageList']['enableMessageGrouping'];

    keyboardAvoidOffset?: OpenChannelProps['Provider']['keyboardAvoidOffset'];
    flatListProps?: OpenChannelProps['MessageList']['flatListProps'];
    sortComparator?: UseOpenChannelMessagesOptions['sortComparator'];
    queryCreator?: UseOpenChannelMessagesOptions['queryCreator'];
  };
  Header: {
    rightIconName: keyof typeof Icon.Assets;
    onPressHeaderLeft: () => void;
    onPressHeaderRight: () => void;
  };

  MessageList: Pick<
    ChannelMessageListProps<SendbirdOpenChannel>,
    | 'enableMessageGrouping'
    | 'currentUserId'
    | 'channel'
    | 'messages'
    | 'newMessages'
    | 'scrolledAwayFromBottom'
    | 'onScrolledAwayFromBottom'
    | 'onTopReached'
    | 'onBottomReached'
    | 'onResendFailedMessage'
    | 'onDeleteMessage'
    | 'onPressMediaMessage'
    | 'renderMessage'
    | 'renderNewMessagesButton'
    | 'renderScrollToBottomButton'
    | 'flatListProps'
    | 'hasNext'
  >;
  Input: PickPartial<
    ChannelInputProps,
    | 'shouldRenderInput'
    | 'onPressSendUserMessage'
    | 'onPressSendFileMessage'
    | 'onPressUpdateUserMessage'
    | 'onPressUpdateFileMessage'
    | 'AttachmentsButton',
    'inputDisabled'
  >;

  Provider: {
    channel: SendbirdOpenChannel;
    keyboardAvoidOffset?: number;
    openChannelPubSub: PubSub<OpenChannelPubSubContextPayload>;
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
  PubSub: React.Context<PubSub<OpenChannelPubSubContextPayload>>;
};
export interface OpenChannelModule {
  Provider: CommonComponent<OpenChannelProps['Provider']>;
  Header: CommonComponent<OpenChannelProps['Header']>;
  MessageList: CommonComponent<OpenChannelProps['MessageList']>;
  Input: CommonComponent<OpenChannelProps['Input']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
}

export type OpenChannelFragment = React.FC<OpenChannelProps['Fragment']>;

export type OpenChannelPubSubContextPayload =
  | {
      type: 'MESSAGE_SENT_PENDING' | 'MESSAGE_SENT_SUCCESS';
      data: {
        message: SendbirdUserMessage | SendbirdFileMessage;
      };
    }
  | {
      type: 'MESSAGES_RECEIVED';
      data: {
        messages: SendbirdMessage[];
      };
    };
