import type React from 'react';
import type Sendbird from 'sendbird';

import type { UseGroupChannelMessagesOptions } from '@sendbird/chat-react-hooks';
import type { BaseHeaderProps } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type GroupChannelProps = {
  Fragment: {
    channel: Sendbird.GroupChannel;
    enableMessageGrouping?: boolean;

    MessageRenderer?: CommonComponent<{
      message: SendbirdMessage;
      prevMessage?: SendbirdMessage;
      enableMessageGrouping?: boolean;
    }>;
    NewMessageTooltip?: GroupChannelProps['MessageList']['NewMessageTooltip'];

    Header?: GroupChannelProps['Header']['Header'];
    onPressHeaderLeft: GroupChannelProps['Header']['onPressHeaderLeft'];
    onPressHeaderRight: GroupChannelProps['Header']['onPressHeaderRight'];

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
    messages: SendbirdMessage[];
    nextMessages: SendbirdMessage[];
    newMessagesFromNext: SendbirdMessage[];
    onTopReached: () => void;
    onBottomReached: () => void;

    renderMessage: (message: SendbirdMessage, prevMessage?: SendbirdMessage) => React.ReactElement | null;
    NewMessageTooltip: null | CommonComponent<{ newMessages: SendbirdMessage[] }>;
  };
};

/**
 * Internal context for GroupChannel
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type GroupChannelContextType = {
  Fragment: React.Context<{
    headerTitle: string;
    channel: Sendbird.GroupChannel;
  }>;
};
export interface GroupChannelModule {
  Provider: React.FC<{ channel: Sendbird.GroupChannel }>;
  Header: CommonComponent<GroupChannelProps['Header']>;
  MessageList: CommonComponent<GroupChannelProps['MessageList']>;
}

export type GroupChannelFragment = React.FC<GroupChannelProps['Fragment']>;
