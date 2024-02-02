import type React from 'react';
import type { FlatListProps } from 'react-native';

import type { SendbirdBaseMessage, SendbirdGroupChannel, SendbirdMessageSearchQuery } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type MessageSearchProps = {
  Fragment: {
    channel: SendbirdGroupChannel;
    onPressHeaderLeft: MessageSearchProps['Header']['onPressHeaderLeft'];
    onPressSearchResultItem: MessageSearchProps['List']['onPressSearchResultItem'];
    renderSearchResultItem?: MessageSearchProps['List']['renderSearchResultItem'];
    queryCreator?: () => SendbirdMessageSearchQuery;
  };
  Header: {
    keyword: string;
    onChangeKeyword: (value: string) => void;
    onPressHeaderLeft: () => void;
    onPressHeaderRight: () => void;
  };
  List: {
    channel: SendbirdGroupChannel;
    messages: SendbirdBaseMessage[];
    onPressSearchResultItem: (params: { channel: SendbirdGroupChannel; message: SendbirdBaseMessage }) => void;
    renderSearchResultItem: (props: {
      channel: SendbirdGroupChannel;
      message: SendbirdBaseMessage;
      onPress: () => void;
    }) => React.ReactElement | null;
    flatListProps?: Partial<FlatListProps<SendbirdBaseMessage>>;
  };
  StatusError: {
    onPressRetry: () => void;
  };
};

/**
 * Internal context for MessageSearch
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type MessageSearchContextsType = {
  Fragment: React.Context<null>;
};
export interface MessageSearchModule {
  Provider: CommonComponent;
  Header: CommonComponent<MessageSearchProps['Header']>;
  List: CommonComponent<MessageSearchProps['List']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
  StatusError: CommonComponent<MessageSearchProps['StatusError']>;
}

export type MessageSearchFragment = React.FC<MessageSearchProps['Fragment']>;
