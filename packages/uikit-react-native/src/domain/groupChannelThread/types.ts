import type React from 'react';
import type { FlatList } from 'react-native';

import type { UseGroupChannelMessagesOptions } from '@sendbird/uikit-chat-hooks';
import type {
  OnBeforeHandler,
  PickPartial,
  SendbirdFileMessage,
  SendbirdFileMessageCreateParams,
  SendbirdFileMessageUpdateParams,
  SendbirdGroupChannel,
  SendbirdMessage,
  SendbirdUserMessage,
  SendbirdUserMessageCreateParams,
  SendbirdUserMessageUpdateParams,
} from '@sendbird/uikit-utils';

import type { ChannelInputProps, SuggestedMentionListProps } from '../../components/ChannelInput';
import type { ChannelThreadMessageListProps } from '../../components/ChannelThreadMessageList';
import type { CommonComponent } from '../../types';
import type { PubSub } from '../../utils/pubsub';

export interface GroupChannelThreadProps {
  Fragment: {
    channel: SendbirdGroupChannel;
    parentMessage: SendbirdUserMessage | SendbirdFileMessage;
    startingPoint?: number;
    onParentMessageDeleted: () => void;
    onChannelDeleted: () => void;
    onPressHeaderLeft: GroupChannelThreadProps['Header']['onPressLeft'];
    onPressHeaderSubtitle?: GroupChannelThreadProps['Header']['onPressSubtitle'];
    onPressMediaMessage?: GroupChannelThreadProps['MessageList']['onPressMediaMessage'];

    onBeforeSendUserMessage?: OnBeforeHandler<SendbirdUserMessageCreateParams>;
    onBeforeSendFileMessage?: OnBeforeHandler<SendbirdFileMessageCreateParams>;
    onBeforeUpdateUserMessage?: OnBeforeHandler<SendbirdUserMessageUpdateParams>;
    onBeforeUpdateFileMessage?: OnBeforeHandler<SendbirdFileMessageUpdateParams>;

    renderMessage?: GroupChannelThreadProps['MessageList']['renderMessage'];

    enableMessageGrouping?: GroupChannelThreadProps['MessageList']['enableMessageGrouping'];

    keyboardAvoidOffset?: GroupChannelThreadProps['Provider']['keyboardAvoidOffset'];
    flatListProps?: GroupChannelThreadProps['MessageList']['flatListProps'];
    sortComparator?: UseGroupChannelMessagesOptions['sortComparator'];
  };
  Header: {
    onPressLeft: () => void;
    onPressSubtitle: () => void;
  };
  ParentMessageInfo: {
    channel: SendbirdGroupChannel;
    currentUserId?: string;
    onDeleteMessage: (message: SendbirdUserMessage | SendbirdFileMessage) => Promise<void>;
    onPressMediaMessage?: (message: SendbirdFileMessage, deleteMessage: () => Promise<void>, uri: string) => void;
  };
  MessageList: Pick<
    ChannelThreadMessageListProps<SendbirdGroupChannel>,
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
    | 'flatListProps'
    | 'hasNext'
    | 'searchItem'
  > & {
    onResetMessageList: () => Promise<void>;
    onResetMessageListWithStartingPoint: (startingPoint: number) => Promise<void>;
    startingPoint?: number;
  };
  Input: PickPartial<
    ChannelInputProps,
    | 'shouldRenderInput'
    | 'onPressSendUserMessage'
    | 'onPressSendFileMessage'
    | 'onPressUpdateUserMessage'
    | 'onPressUpdateFileMessage'
    | 'SuggestedMentionList'
    | 'AttachmentsButton',
    'inputDisabled'
  >;

  SuggestedMentionList: SuggestedMentionListProps;
  Provider: {
    channel: SendbirdGroupChannel;
    keyboardAvoidOffset?: number;
    groupChannelThreadPubSub: PubSub<GroupChannelThreadPubSubContextPayload>;
    parentMessage: SendbirdUserMessage | SendbirdFileMessage;
    threadedMessages: SendbirdMessage[];
  };
}

/**
 * Internal context for GroupChannelThread
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export interface GroupChannelThreadContextsType {
  Fragment: React.Context<{
    headerTitle: string;
    keyboardAvoidOffset?: number;
    channel: SendbirdGroupChannel;
    parentMessage: SendbirdUserMessage | SendbirdFileMessage;
    messageToEdit?: SendbirdUserMessage | SendbirdFileMessage;
    setMessageToEdit: (msg?: SendbirdUserMessage | SendbirdFileMessage) => void;
  }>;
  PubSub: React.Context<PubSub<GroupChannelThreadPubSubContextPayload>>;
  MessageList: React.Context<{
    /**
     * ref object for FlatList of MessageList
     * */
    flatListRef: React.MutableRefObject<FlatList | null>;
    /**
     * Function that scrolls to a message within a group channel.
     * @param messageId {number} - The id of the message to scroll.
     * @param options {object} - Scroll options (optional).
     * @param options.focusAnimated {boolean} - Enable a shake animation on the message component upon completion of scrolling.
     * @param options.viewPosition {number} - Position information to adjust the visible area during scrolling. bottom(0) ~ top(1.0)
     *
     * @example
     * ```
     *   const { scrollToMessage } = useContext(GroupChannelThreadContexts.MessageList);
     *   const messageIncludedInMessageList = scrollToMessage(lastMessage.messageId, { focusAnimated: true, viewPosition: 1 });
     *   if (!messageIncludedInMessageList) console.warn('Message not found in the message list.');
     * ```
     * */
    scrollToMessage: (messageId: number, options?: { focusAnimated?: boolean; viewPosition?: number }) => boolean;
    /**
     * Call the FlatList function asynchronously to scroll to bottom lazily
     * to avoid scrolling before data rendering has been committed.
     * */
    lazyScrollToBottom: (params?: { animated?: boolean; timeout?: number }) => void;
    /**
     * Call the FlatList function asynchronously to scroll to index lazily.
     * to avoid scrolling before data rendering has been committed.
     * */
    lazyScrollToIndex: (params?: {
      index?: number;
      animated?: boolean;
      timeout?: number;
      viewPosition?: number;
    }) => void;
  }>;
}

export interface GroupChannelThreadModule {
  Provider: CommonComponent<GroupChannelThreadProps['Provider']>;
  Header: CommonComponent<GroupChannelThreadProps['Header']>;
  ParentMessageInfo: CommonComponent<GroupChannelThreadProps['ParentMessageInfo']>;
  MessageList: CommonComponent<GroupChannelThreadProps['MessageList']>;
  Input: CommonComponent<GroupChannelThreadProps['Input']>;
  SuggestedMentionList: CommonComponent<GroupChannelThreadProps['SuggestedMentionList']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
}

export type GroupChannelThreadFragment = React.FC<GroupChannelThreadProps['Fragment']>;

export type GroupChannelThreadPubSubContextPayload =
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
    }
  | {
      type: 'TYPING_BUBBLE_RENDERED';
      data?: undefined;
    };
