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

/**
 * Function that scrolls to a message within a group channel.
 * @param messageId {number} - The id of the message to scroll.
 * @param options {object} - Scroll options (optional).
 * @param options.focusAnimated {boolean} - Enable a shake animation on the message component upon completion of scrolling.
 * @param options.viewPosition {number} - Position information to adjust the visible area during scrolling. bottom(0) ~ top(1.0)
 *
 * @example
 * ```
 *   const { scrollToMessage } = useContext(GroupChannelContexts.Fragment);
 *   const messageIncludedInMessageList = scrollToMessage(lastMessage.messageId, { focusAnimated: true, viewPosition: 1 });
 *   if (!messageIncludedInMessageList) console.warn('Message not found in the message list.');
 * ```
 * */
export type GroupChannelScrollToMessageFunc = (
  messageId: number,
  options?: { focusAnimated?: boolean; viewPosition?: number },
) => void;

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
    onResetMessageListWithStartingPoint: (startingPoint: number, callback?: () => void) => void;

    // Changing the search item will trigger the focus animation on messages.
    onUpdateSearchItem: (searchItem?: GroupChannelProps['MessageList']['searchItem']) => void;
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
    keyboardAvoidOffset?: number;
    channel: SendbirdGroupChannel;
    messageToEdit?: SendbirdUserMessage | SendbirdFileMessage;
    setMessageToEdit: (msg?: SendbirdUserMessage | SendbirdFileMessage) => void;
    messageToReply?: SendbirdUserMessage | SendbirdFileMessage;
    setMessageToReply: (msg?: SendbirdUserMessage | SendbirdFileMessage) => void;
    scrollToMessage: GroupChannelScrollToMessageFunc;
    __internalSetScrollToMessageFunc: (func: () => GroupChannelScrollToMessageFunc) => void;
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
      type: 'MESSAGES_RECEIVED' | 'MESSAGES_UPDATED';
      data: {
        messages: SendbirdMessage[];
      };
    };
