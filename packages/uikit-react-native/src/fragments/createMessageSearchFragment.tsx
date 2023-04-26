import React, { useState } from 'react';

import { MessageSearchOrder } from '@sendbird/chat/message';
import {
  Logger,
  NOOP,
  SendbirdBaseMessage,
  SendbirdChatSDK,
  SendbirdMessageSearchQuery,
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

function getMessageSearchQuery(sdk: SendbirdChatSDK, options: SearchQueryOptions) {
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

    const search = useFreshCallback(async () => {
      const query = getMessageSearchQuery(sdk, {
        keyword,
        channelUrl: channel.url,
        messageTimestampFrom: Math.max(channel.joinedAt, channel.invitedAt),
        order: MessageSearchOrder.TIMESTAMP,
        queryCreator,
      });

      setQuery(query);
      setLoading(true);
      setError(null);

      try {
        const result = await query.next();
        setSearchResults(result);
      } catch (err) {
        Logger.debug('[MessageSearchFragment] search failure', err);
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
          Logger.debug('[MessageSearchFragment] next failure', err);
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
