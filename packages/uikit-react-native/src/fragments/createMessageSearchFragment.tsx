import React, { useRef, useState } from 'react';

import { MessageSearchOrder } from '@sendbird/chat/message';
import {
  Logger,
  NOOP,
  SendbirdBaseMessage,
  SendbirdChatSDK,
  SendbirdGroupChannel,
  SendbirdMessageSearchQuery,
  useFreshCallback,
  useSafeAreaPadding,
} from '@sendbird/uikit-utils';

import MessageSearchResultItem from '../components/MessageSearchResultItem';
import StatusComposition from '../components/StatusComposition';
import { createMessageSearchModule } from '../domain/messageSearch';
import type { MessageSearchFragment, MessageSearchModule, MessageSearchProps } from '../domain/messageSearch/types';
import { useSendbirdChat } from '../hooks/useContext';

type DefaultMessageSearchQueryParams = {
  keyword: string;
  channelUrl: string;
  messageTimestampFrom: number;
  order: MessageSearchOrder;
};

type SearchQueryOptions = DefaultMessageSearchQueryParams & {
  queryCreator?: (params: DefaultMessageSearchQueryParams) => SendbirdMessageSearchQuery;
};

function getMessageSearchQuery(sdk: SendbirdChatSDK, options: SearchQueryOptions) {
  if (options.queryCreator) return options.queryCreator(options);
  return sdk.createMessageSearchQuery(options);
}

const createMessageSearchFragment = (initModule?: Partial<MessageSearchModule>): MessageSearchFragment => {
  const MessageSearchModule = createMessageSearchModule(initModule);

  return ({ onPressHeaderLeft = NOOP, channel, queryCreator, renderSearchResultItem, onPressSearchResultItem }) => {
    const padding = useSafeAreaPadding(['left', 'right', 'bottom']);

    const { sdk } = useSendbirdChat();
    const { keyword, setKeyword, search, searchResults, loading, next, error, query } = useMessageSearch(sdk, {
      channel,
      queryCreator,
    });

    const renderItem: MessageSearchProps['List']['renderSearchResultItem'] = useFreshCallback((props) => {
      if (renderSearchResultItem) return renderSearchResultItem(props);
      return <MessageSearchResultItem {...props} />;
    });

    return (
      <MessageSearchModule.Provider>
        <MessageSearchModule.Header
          keyword={keyword}
          onChangeKeyword={setKeyword}
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={search}
        />
        <StatusComposition
          loading={loading}
          LoadingComponent={<MessageSearchModule.StatusLoading />}
          error={Boolean(error)}
          ErrorComponent={<MessageSearchModule.StatusError onPressRetry={search} />}
        >
          {query && (
            <MessageSearchModule.List
              channel={channel}
              onPressSearchResultItem={onPressSearchResultItem}
              messages={searchResults}
              renderSearchResultItem={renderItem}
              flatListProps={{
                keyboardDismissMode: 'on-drag',
                keyboardShouldPersistTaps: 'handled',
                onEndReached: next,
                ListEmptyComponent: MessageSearchModule.StatusEmpty,
                contentContainerStyle: { flexGrow: 1, ...padding },
              }}
            />
          )}
        </StatusComposition>
      </MessageSearchModule.Provider>
    );
  };
};

const useMessageSearch = (
  sdk: SendbirdChatSDK,
  { channel, queryCreator }: { channel: SendbirdGroupChannel; queryCreator: SearchQueryOptions['queryCreator'] },
) => {
  const [query, setQuery] = useState<SendbirdMessageSearchQuery>();
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [searchResults, setSearchResults] = useState<SendbirdBaseMessage[]>([]);
  const queryInProgress = useRef(false);

  const search = useFreshCallback(async () => {
    if (keyword.length <= 0) return;
    if (queryInProgress.current) return;

    const query = getMessageSearchQuery(sdk, {
      keyword,
      channelUrl: channel.url,
      messageTimestampFrom: channel.messageOffsetTimestamp,
      order: MessageSearchOrder.TIMESTAMP,
      queryCreator,
    });

    setQuery(query);
    setLoading(true);
    setError(null);

    try {
      queryInProgress.current = true;
      const result = await query.next();
      setSearchResults(result);
    } catch (err) {
      Logger.warn('[MessageSearchFragment] search failure', err);
      setError(err);
    } finally {
      queryInProgress.current = false;
      setLoading(false);
    }
  });

  const next = useFreshCallback(async () => {
    if (!query?.hasNext) return;
    if (queryInProgress.current) return;

    try {
      queryInProgress.current = true;
      const result = await query.next();
      setSearchResults((prev) => [...prev, ...result]);
    } catch (err) {
      Logger.warn('[MessageSearchFragment] next failure', err);
      setError(err);
    } finally {
      queryInProgress.current = false;
    }
  });

  return {
    keyword,
    setKeyword,

    query,
    loading,
    error,
    searchResults,

    search,
    next,
  };
};

export default createMessageSearchFragment;
