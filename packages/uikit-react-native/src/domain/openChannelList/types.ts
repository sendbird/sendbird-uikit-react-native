import type React from 'react';
import type { FlatListProps } from 'react-native';

import type { UseOpenChannelListOptions } from '@sendbird/uikit-chat-hooks';
import type { SendbirdOpenChannel } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type OpenChannelListProps = {
  Fragment: {
    /** Handler for navigating to OpenChannelFragment **/
    onPressChannel: (channel: SendbirdOpenChannel) => void;
    /** Handler for navigating to OpenChannelCreateFragment **/
    onPressCreateChannel: () => void;
    /** Method for rendering open channel preview **/
    renderOpenChannelPreview?: OpenChannelListProps['List']['renderOpenChannelPreview'];
    /** Method for creating a custom query of open channel list **/
    queryCreator?: UseOpenChannelListOptions['queryCreator'];
    /** Props for FlatList component, it passed to OpenChannelList.List **/
    flatListProps?: OpenChannelListProps['List']['flatListProps'];
  };
  Header: {
    onPressHeaderRight: () => void;
  };
  List: {
    /** OpenChannels from SendbirdChat SDK **/
    openChannels: SendbirdOpenChannel[];
    /** Method for rendering a preview of each open channel **/
    renderOpenChannelPreview: (props: { channel: SendbirdOpenChannel }) => React.ReactElement | null;
    /** Handler for loading the next batch of open channels **/
    onLoadNext: () => Promise<void>;
    /** Props for the FlatList component, passed to the OpenChannelList.List **/
    flatListProps?: Omit<FlatListProps<SendbirdOpenChannel>, 'data' | 'renderItem'>;
    /** Props for the indicates if the FlatList is currently being refreshed  **/
    refreshing: boolean;
    /** Handler for refreshing the list of open channels **/
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

export type OpenChannelListFragment = CommonComponent<OpenChannelListProps['Fragment']>;
