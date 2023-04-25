import React, { useState } from 'react';

import type { MessageSearchOrder } from '@sendbird/chat/message';
import {
  NOOP,
  SendbirdBaseMessage,
  SendbirdChatSDK,
  SendbirdMessageSearchQuery,
  getDefaultMessageSearchQueryParams,
  useFreshCallback,
  useSafeAreaPadding,
} from '@sendbird/uikit-utils';

import { MessageSearchListItem } from '../components/MessageSearchListItem';
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

function createMessageSearchQuery(sdk: SendbirdChatSDK, options: SearchQueryOptions) {
  if (options.queryCreator) return options.queryCreator(options);
  return sdk.createMessageSearchQuery(options);
}

const createMessageSearchFragment = (initModule?: Partial<MessageSearchModule>): MessageSearchFragment => {
  const MessageSearchModule = createMessageSearchModule(initModule);

  return ({ onPressHeaderLeft = NOOP, onPressMessage, channel, queryCreator }) => {
    const { sdk } = useSendbirdChat();
    const padding = useSafeAreaPadding(['left', 'right', 'bottom']);

    const [query, setQuery] = useState<SendbirdMessageSearchQuery>();
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [searchResults, setSearchResults] = useState<SendbirdBaseMessage[]>([]);

    const buildQuery = () => {
      const params = getDefaultMessageSearchQueryParams(channel, keyword);
      return createMessageSearchQuery(sdk, { ...params, queryCreator });
    };

    const search = useFreshCallback(async () => {
      const query = buildQuery();
      setQuery(query);
      setLoading(true);
      setError(null);

      try {
        const result = await query.next();
        setSearchResults(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    });

    const next = useFreshCallback(async () => {
      if (query?.hasNext) {
        try {
          const result = await query.next();
          setSearchResults((prev) => [...prev, ...result]);
        } catch (err) {
          setError(err);
        }
      }
    });

    const renderMessage: MessageSearchProps['List']['renderMessage'] = useFreshCallback(({ message }) => {
      return <MessageSearchListItem onPressMessage={onPressMessage} channel={channel} message={message} />;
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
              messages={searchResults}
              renderMessage={renderMessage}
              flatlistProps={{
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

export default createMessageSearchFragment;
