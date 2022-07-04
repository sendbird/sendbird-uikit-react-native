import type React from 'react';
import type { FlatListProps } from 'react-native';
import type Sendbird from 'sendbird';

import type { UseGroupChannelMessagesOptions } from '@sendbird/uikit-chat-hooks';
import type { BaseHeaderProps } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';

import type { FileType } from '../../platform/types';
import type { CommonComponent } from '../../types';

export type GroupChannelProps = {
  Fragment: {
    onBeforeSendFileMessage?: (
      params: Sendbird.FileMessageParams,
    ) => Sendbird.FileMessageParams | Promise<Sendbird.FileMessageParams>;
    onBeforeSendUserMessage?: (
      params: Sendbird.UserMessageParams,
    ) => Sendbird.UserMessageParams | Promise<Sendbird.UserMessageParams>;
    onChannelDeleted: () => void;
    onPressHeaderLeft: GroupChannelProps['Header']['onPressHeaderLeft'];
    onPressHeaderRight: GroupChannelProps['Header']['onPressHeaderRight'];
    onPressImageMessage: GroupChannelProps['MessageList']['onPressImageMessage'];

    staleChannel: Sendbird.GroupChannel;
    renderMessage?: GroupChannelProps['MessageList']['renderMessage'];
    NewMessagesTooltip?: GroupChannelProps['MessageList']['NewMessagesTooltip'];
    ScrollToBottomTooltip?: GroupChannelProps['MessageList']['ScrollToBottomTooltip'];
    Header?: GroupChannelProps['Header']['Header'];

    enableTypingIndicator?: GroupChannelProps['Provider']['enableTypingIndicator'];
    enableMessageGrouping?: GroupChannelProps['MessageList']['enableMessageGrouping'];

    keyboardAvoidOffset?: GroupChannelProps['Provider']['keyboardAvoidOffset'];
    flatListProps?: GroupChannelProps['MessageList']['flatListProps'];
    sortComparator?: UseGroupChannelMessagesOptions['sortComparator'];
    collectionCreator?: UseGroupChannelMessagesOptions['collectionCreator'];
    queryCreator?: UseGroupChannelMessagesOptions['queryCreator'];
  };
  Header: {
    Header?: null | CommonComponent<
      BaseHeaderProps<{
        title: string | React.ReactElement;
        left: React.ReactElement;
        onPressLeft: () => void;
      }>
    >;
    onPressHeaderLeft: () => void;
    onPressHeaderRight: () => void;
  };
  MessageList: {
    enableMessageGrouping: boolean;
    currentUserId?: string;
    channel: Sendbird.GroupChannel;
    messages: SendbirdMessage[];
    nextMessages: SendbirdMessage[];
    newMessagesFromNext: SendbirdMessage[];
    onTopReached: () => void;
    onBottomReached: () => void;

    onResendFailedMessage: (failedMessage: Sendbird.UserMessage | Sendbird.FileMessage) => Promise<void>;
    onDeleteMessage: (message: Sendbird.UserMessage | Sendbird.FileMessage) => Promise<void>;
    onPressImageMessage: (message: Sendbird.FileMessage, uri: string) => void;

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
    channel: Sendbird.GroupChannel;
    onSendFileMessage: (file: FileType) => Promise<void>;
    onSendUserMessage: (text: string) => Promise<void>;
    onUpdateFileMessage: (editedFile: FileType, message: Sendbird.FileMessage) => Promise<void>;
    onUpdateUserMessage: (editedText: string, message: Sendbird.UserMessage) => Promise<void>;
  };
  Provider: {
    channel: Sendbird.GroupChannel;
    enableTypingIndicator: boolean;
    keyboardAvoidOffset?: number;
  };
};

/**
 * Internal context for GroupChannel
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type GroupChannelContextsType = {
  Fragment: React.Context<{
    headerTitle: string;
    channel: Sendbird.GroupChannel;
    editMessage?: Sendbird.UserMessage | Sendbird.FileMessage;
    setEditMessage: (msg?: Sendbird.UserMessage | Sendbird.FileMessage) => void;
    keyboardAvoidOffset?: number;
  }>;
  TypingIndicator: React.Context<{
    typingUsers: Sendbird.User[];
  }>;
};
export interface GroupChannelModule {
  Provider: React.FC<GroupChannelProps['Provider']>;
  Header: CommonComponent<GroupChannelProps['Header']>;
  MessageList: CommonComponent<GroupChannelProps['MessageList']>;
  Input: CommonComponent<GroupChannelProps['Input']>;
}

export type GroupChannelFragment = React.FC<GroupChannelProps['Fragment']>;
