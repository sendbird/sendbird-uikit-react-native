import type React from 'react';

import type { UseGroupChannelMessagesOptions } from '@sendbird/uikit-chat-hooks';
import type {
  OnBeforeHandler,
  SendbirdFileMessage,
  SendbirdFileMessageCreateParams,
  SendbirdFileMessageUpdateParams,
  SendbirdGroupChannel,
  SendbirdMessage,
  SendbirdUser,
  SendbirdUserMessage,
  SendbirdUserMessageCreateParams,
  SendbirdUserMessageUpdateParams,
} from '@sendbird/uikit-utils';

import type { ChannelInputProps, SuggestedMentionListProps } from '../../components/ChannelInput';
import type { ChannelMessageListProps } from '../../components/ChannelMessageList';
import type { CommonComponent } from '../../types';
import type { PubSub } from '../../utils/pubsub';

export interface GroupChannelProps {
  Fragment: {
    channel: SendbirdGroupChannel;
    onChannelDeleted: () => void;
    onPressHeaderLeft: GroupChannelProps['Header']['onPressHeaderLeft'];
    onPressHeaderRight: GroupChannelProps['Header']['onPressHeaderRight'];
    onPressMediaMessage?: GroupChannelProps['MessageList']['onPressMediaMessage'];

    onBeforeSendUserMessage?: OnBeforeHandler<SendbirdUserMessageCreateParams>;
    onBeforeSendFileMessage?: OnBeforeHandler<SendbirdFileMessageCreateParams>;
    onBeforeUpdateUserMessage?: OnBeforeHandler<SendbirdUserMessageUpdateParams>;
    onBeforeUpdateFileMessage?: OnBeforeHandler<SendbirdFileMessageUpdateParams>;

    renderMessage?: GroupChannelProps['MessageList']['renderMessage'];
    renderNewMessagesButton?: GroupChannelProps['MessageList']['renderNewMessagesButton'];
    renderScrollToBottomButton?: GroupChannelProps['MessageList']['renderScrollToBottomButton'];

    enableTypingIndicator?: GroupChannelProps['Provider']['enableTypingIndicator'];
    enableMessageGrouping?: GroupChannelProps['MessageList']['enableMessageGrouping'];

    keyboardAvoidOffset?: GroupChannelProps['Provider']['keyboardAvoidOffset'];
    flatListProps?: GroupChannelProps['MessageList']['flatListProps'];
    sortComparator?: UseGroupChannelMessagesOptions['sortComparator'];
    collectionCreator?: UseGroupChannelMessagesOptions['collectionCreator'];

    searchItem?: GroupChannelProps['MessageList']['searchItem'];
  };
  Header: {
    shouldHideRight: () => boolean;
    onPressHeaderLeft: () => void;
    onPressHeaderRight: () => void;
  };
  MessageList: Pick<
    ChannelMessageListProps<SendbirdGroupChannel>,
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
    | 'searchItem'
  > & {
    onResetMessageList: (callback?: () => void) => void;
  };
  Input: Pick<
    ChannelInputProps,
    | 'shouldRenderInput'
    | 'onPressSendUserMessage'
    | 'onPressSendFileMessage'
    | 'onPressUpdateUserMessage'
    | 'onPressUpdateFileMessage'
    | 'SuggestedMentionList'
    | 'AttachmentsButton'
  >;

  SuggestedMentionList: SuggestedMentionListProps;
  Provider: {
    channel: SendbirdGroupChannel;
    enableTypingIndicator: boolean;
    keyboardAvoidOffset?: number;
    groupChannelPubSub: PubSub<GroupChannelPubSubContextPayload>;
  };
}

/**
 * Internal context for GroupChannel
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export interface GroupChannelContextsType {
  Fragment: React.Context<{
    headerTitle: string;
    channel: SendbirdGroupChannel;
    messageToEdit?: SendbirdUserMessage | SendbirdFileMessage;
    setMessageToEdit: (msg?: SendbirdUserMessage | SendbirdFileMessage) => void;
    keyboardAvoidOffset?: number;
  }>;
  TypingIndicator: React.Context<{
    typingUsers: SendbirdUser[];
  }>;
  PubSub: React.Context<PubSub<GroupChannelPubSubContextPayload>>;
}
export interface GroupChannelModule {
  Provider: CommonComponent<GroupChannelProps['Provider']>;
  Header: CommonComponent<GroupChannelProps['Header']>;
  MessageList: CommonComponent<GroupChannelProps['MessageList']>;
  Input: CommonComponent<GroupChannelProps['Input']>;
  SuggestedMentionList: CommonComponent<GroupChannelProps['SuggestedMentionList']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
}

export type GroupChannelFragment = CommonComponent<GroupChannelProps['Fragment']>;

export type GroupChannelPubSubContextPayload =
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
