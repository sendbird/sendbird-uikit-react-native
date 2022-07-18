import type React from 'react';
import type { FlatListProps } from 'react-native';

import type { UseGroupChannelMessagesOptions } from '@sendbird/uikit-chat-hooks';
import type {
  SendbirdFileMessage,
  SendbirdFileMessageParams,
  SendbirdGroupChannel,
  SendbirdMessage,
  SendbirdUser,
  SendbirdUserMessage,
  SendbirdUserMessageParams,
} from '@sendbird/uikit-utils';

import type { FileType } from '../../platform/types';
import type { CommonComponent } from '../../types';

export interface GroupChannelProps {
  Fragment: {
    staleChannel: SendbirdGroupChannel;
    onChannelDeleted: () => void;
    onPressHeaderLeft: GroupChannelProps['Header']['onPressHeaderLeft'];
    onPressHeaderRight: GroupChannelProps['Header']['onPressHeaderRight'];

    onBeforeSendFileMessage?: (
      params: SendbirdFileMessageParams,
    ) => SendbirdFileMessageParams | Promise<SendbirdFileMessageParams>;
    onBeforeSendUserMessage?: (
      params: SendbirdUserMessageParams,
    ) => SendbirdUserMessageParams | Promise<SendbirdUserMessageParams>;
    onPressImageMessage?: GroupChannelProps['MessageList']['onPressImageMessage'];

    renderMessage?: GroupChannelProps['MessageList']['renderMessage'];
    NewMessagesTooltip?: GroupChannelProps['MessageList']['NewMessagesTooltip'];
    ScrollToBottomTooltip?: GroupChannelProps['MessageList']['ScrollToBottomTooltip'];

    enableTypingIndicator?: GroupChannelProps['Provider']['enableTypingIndicator'];
    enableMessageGrouping?: GroupChannelProps['MessageList']['enableMessageGrouping'];

    keyboardAvoidOffset?: GroupChannelProps['Provider']['keyboardAvoidOffset'];
    flatListProps?: GroupChannelProps['MessageList']['flatListProps'];
    sortComparator?: UseGroupChannelMessagesOptions['sortComparator'];
    collectionCreator?: UseGroupChannelMessagesOptions['collectionCreator'];
    queryCreator?: UseGroupChannelMessagesOptions['queryCreator'];
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
    newMessagesFromNext: SendbirdMessage[];
    onTopReached: () => void;
    onBottomReached: () => void;

    onResendFailedMessage: (failedMessage: SendbirdUserMessage | SendbirdFileMessage) => Promise<void>;
    onDeleteMessage: (message: SendbirdUserMessage | SendbirdFileMessage) => Promise<void>;
    onPressImageMessage?: (message: SendbirdFileMessage, uri: string) => void;

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
    NewMessagesTooltip: null | CommonComponent<{
      visible: boolean;
      onPress: () => void;
      newMessages: SendbirdMessage[];
    }>;
    ScrollToBottomTooltip: null | CommonComponent<{
      visible: boolean;
      onPress: () => void;
    }>;
    flatListProps?: Omit<FlatListProps<SendbirdMessage>, 'data' | 'renderItem'>;
  };
  Input: {
    channel: SendbirdGroupChannel;
    onSendFileMessage: (file: FileType) => Promise<void>;
    onSendUserMessage: (text: string) => Promise<void>;
    onUpdateFileMessage: (editedFile: FileType, message: SendbirdFileMessage) => Promise<void>;
    onUpdateUserMessage: (editedText: string, message: SendbirdUserMessage) => Promise<void>;
  };
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
    editMessage?: SendbirdUserMessage | SendbirdFileMessage;
    setEditMessage: (msg?: SendbirdUserMessage | SendbirdFileMessage) => void;
    keyboardAvoidOffset?: number;
  }>;
  TypingIndicator: React.Context<{
    typingUsers: SendbirdUser[];
  }>;
}
export interface GroupChannelModule {
  Provider: React.FC<GroupChannelProps['Provider']>;
  Header: CommonComponent<GroupChannelProps['Header']>;
  MessageList: CommonComponent<GroupChannelProps['MessageList']>;
  Input: CommonComponent<GroupChannelProps['Input']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
}

export type GroupChannelFragment = React.FC<GroupChannelProps['Fragment']>;
