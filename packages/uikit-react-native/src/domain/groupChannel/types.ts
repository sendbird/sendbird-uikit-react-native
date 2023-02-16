import type React from 'react';
import type { FlatListProps } from 'react-native';

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
import type { CommonComponent } from '../../types';

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
    queryCreator?: UseGroupChannelMessagesOptions['queryCreator'];

    /** @deprecated `onPressImageMessage` is deprecated, please use `onPressMediaMessage` instead **/
    onPressImageMessage?: GroupChannelProps['MessageList']['onPressImageMessage'];
  };
  Header: {
    onPressHeaderLeft: () => void;
    onPressHeaderRight: () => void;
  };
  MessageList: {
    enableMessageGrouping: boolean;
    currentUserId?: string;
    channel: SendbirdGroupChannel;
    messages: SendbirdMessage[];
    nextMessages: SendbirdMessage[];
    newMessagesFromMembers: SendbirdMessage[];
    onTopReached: () => void;
    onBottomReached: () => void;

    onResendFailedMessage: (failedMessage: SendbirdUserMessage | SendbirdFileMessage) => Promise<void>;
    onDeleteMessage: (message: SendbirdUserMessage | SendbirdFileMessage) => Promise<void>;
    onPressMediaMessage?: (message: SendbirdFileMessage, deleteMessage: () => Promise<void>, uri: string) => void;

    renderMessage: (props: {
      message: SendbirdMessage;
      prevMessage?: SendbirdMessage;
      nextMessage?: SendbirdMessage;
      onPress?: () => void;
      onLongPress?: () => void;
      channel: GroupChannelProps['MessageList']['channel'];
      currentUserId?: GroupChannelProps['MessageList']['currentUserId'];
      enableMessageGrouping: GroupChannelProps['MessageList']['enableMessageGrouping'];
    }) => React.ReactElement | null;
    renderNewMessagesButton: null | CommonComponent<{
      visible: boolean;
      onPress: () => void;
      newMessages: SendbirdMessage[];
    }>;
    renderScrollToBottomButton: null | CommonComponent<{
      visible: boolean;
      onPress: () => void;
    }>;
    flatListProps?: Omit<FlatListProps<SendbirdMessage>, 'data' | 'renderItem'>;

    /** @deprecated `onPressImageMessage` is deprecated, please use `onPressMediaMessage` instead **/
    onPressImageMessage?: (message: SendbirdFileMessage, uri: string) => void;
  };
  Input: Pick<
    ChannelInputProps,
    | 'shouldRenderInput'
    | 'onPressSendUserMessage'
    | 'onPressSendFileMessage'
    | 'onPressUpdateUserMessage'
    | 'onPressUpdateFileMessage'
    | 'SuggestedMentionList'
    | 'onSendFileMessage'
    | 'onSendUserMessage'
    | 'onUpdateFileMessage'
    | 'onUpdateUserMessage'
  >;

  SuggestedMentionList: SuggestedMentionListProps;
  Provider: {
    channel: SendbirdGroupChannel;
    enableTypingIndicator: boolean;
    keyboardAvoidOffset?: number;
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
