import React, { useCallback } from 'react';

import { useGroupChannelMessages } from '@sendbird/chat-react-hooks';
import type { GroupChannelFragment, GroupChannelModule, GroupChannelProps } from '@sendbird/uikit-react-native-core';
import { createGroupChannelModule, useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { EmptyFunction, messageComparator } from '@sendbird/uikit-utils';

import DefaultMessageRenderer from '../ui/MessageRenderer';
import DefaultNewMessagesTooltip from '../ui/NewMessagesTooltip';
import DefaultScrollToBottomTooltip from '../ui/ScrollToBottomTooltip';

const createGroupChannelFragment = (initModule?: GroupChannelModule): GroupChannelFragment => {
  const GroupChannelModule = createGroupChannelModule(initModule);

  return ({
    MessageRenderer = DefaultMessageRenderer,
    NewMessagesTooltip = DefaultNewMessagesTooltip,
    ScrollToBottomTooltip = DefaultScrollToBottomTooltip,
    enableMessageGrouping = true,
    Header,
    onPressHeaderLeft = EmptyFunction,
    onPressHeaderRight = EmptyFunction,
    channel,
    queryCreator,
    collectionCreator,
    sortComparator = messageComparator,
    children,
  }) => {
    const { sdk, currentUser } = useSendbirdChat();

    const { messages, nextMessages, newMessagesFromNext, next, prev } = useGroupChannelMessages(
      sdk,
      channel,
      currentUser?.userId,
      { collectionCreator, queryCreator, sortComparator, enableCollectionWithoutLocalCache: true },
    );

    const renderMessages: GroupChannelProps['MessageList']['renderMessage'] = useCallback(
      (message, prevMessage, nextMessage) => {
        return (
          <MessageRenderer
            message={message}
            prevMessage={prevMessage}
            nextMessage={nextMessage}
            enableMessageGrouping={enableMessageGrouping}
          />
        );
      },
      [MessageRenderer, enableMessageGrouping],
    );

    return (
      <GroupChannelModule.Provider channel={channel}>
        <GroupChannelModule.Header
          Header={Header}
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={onPressHeaderRight}
        />
        <GroupChannelModule.MessageList
          channel={channel}
          messages={messages}
          renderMessage={renderMessages}
          newMessagesFromNext={newMessagesFromNext}
          nextMessages={nextMessages}
          onTopReached={prev}
          onBottomReached={next}
          NewMessagesTooltip={NewMessagesTooltip}
          ScrollToBottomTooltip={ScrollToBottomTooltip}
        />
        {children}
      </GroupChannelModule.Provider>
    );
  };
};

export default createGroupChannelFragment;
