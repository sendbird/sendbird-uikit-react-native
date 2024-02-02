import type React from 'react';
import type { FlatListProps } from 'react-native';

import type { UseOpenChannelListOptions } from '@sendbird/uikit-chat-hooks';
import type { SendbirdOpenChannel } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type OpenChannelListProps = {
  Fragment: {
    onPressChannel: OpenChannelListProps['List']['onPressChannel'];
    onPressCreateChannel: () => void;
    renderOpenChannelPreview?: OpenChannelListProps['List']['renderOpenChannelPreview'];
    queryCreator?: UseOpenChannelListOptions['queryCreator'];
    flatListProps?: OpenChannelListProps['List']['flatListProps'];
  };
  Header: {
    onPressHeaderRight: () => void;
  };
  List: {
    onPressChannel: (channel: SendbirdOpenChannel) => void;
    openChannels: SendbirdOpenChannel[];
    renderOpenChannelPreview: (props: {
      channel: SendbirdOpenChannel;
      onPress: () => void;
    }) => React.ReactElement | null;
    onLoadNext: () => Promise<void>;
    flatListProps?: Omit<FlatListProps<SendbirdOpenChannel>, 'data' | 'renderItem'>;
    refreshing: boolean;
    onRefresh: () => void;
  };
  StatusError: {
    onPressRetry: () => void;
  };
};

/**
 * Internal context for OpenChannelList
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type OpenChannelListContextsType = {
  Fragment: React.Context<{
    headerTitle: string;
  }>;
};
export interface OpenChannelListModule {
  Provider: CommonComponent;
  Header: CommonComponent<OpenChannelListProps['Header']>;
  List: CommonComponent<OpenChannelListProps['List']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
  StatusError: CommonComponent<OpenChannelListProps['StatusError']>;
}

export type OpenChannelListFragment = React.FC<OpenChannelListProps['Fragment']>;
