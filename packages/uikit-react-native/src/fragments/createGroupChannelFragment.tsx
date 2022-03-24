import React, { useCallback, useEffect } from 'react';

import { useGroupChannelMessages } from '@sendbird/chat-react-hooks';
import useInternalPubSub from '@sendbird/chat-react-hooks/src/common/useInternalPubSub';
import type { GroupChannelFragment, GroupChannelModule, GroupChannelProps } from '@sendbird/uikit-react-native-core';
import { createGroupChannelModule, useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { EmptyFunction, messageComparator } from '@sendbird/uikit-utils';

import DefaultMessageRenderer from '../ui/MessageRenderer';
import DefaultNewMessagesTooltip from '../ui/NewMessagesTooltip';
import DefaultScrollToBottomTooltip from '../ui/ScrollToBottomTooltip';

const PassValue = <T,>(v: T) => v;

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
    onChannelDeleted = EmptyFunction,
    onBeforeSendFileMessage = PassValue,
    onBeforeSendUserMessage = PassValue,
    staleChannel,
    queryCreator,
    collectionCreator,
    sortComparator = messageComparator,
    children,
  }) => {
    const { sdk, currentUser } = useSendbirdChat();
    const { subscribe, events } = useInternalPubSub();

    const { activeChannel, messages, nextMessages, newMessagesFromNext, next, prev, sendFileMessage, sendUserMessage } =
      useGroupChannelMessages(sdk, staleChannel, currentUser?.userId, {
        collectionCreator,
        queryCreator,
        sortComparator,
        enableCollectionWithoutLocalCache: true,
      });

    useEffect(() => {
      return subscribe(events.ChannelDeleted, ({ channelUrl }) => {
        if (channelUrl === staleChannel.url) onChannelDeleted();
      });
    }, []);

    const renderMessages: GroupChannelProps['MessageList']['renderMessage'] = useCallback(
      (message, prevMessage, nextMessage) => {
        return (
          <MessageRenderer
            channel={activeChannel}
            currentUserId={currentUser?.userId}
            message={message}
            prevMessage={prevMessage}
            nextMessage={nextMessage}
            enableMessageGrouping={enableMessageGrouping}
          />
        );
      },
      [activeChannel, currentUser?.userId, MessageRenderer, enableMessageGrouping],
    );

    return (
      <GroupChannelModule.Provider channel={activeChannel}>
        <GroupChannelModule.Header
          Header={Header}
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={onPressHeaderRight}
        />
        <GroupChannelModule.MessageList
          channel={activeChannel}
          messages={messages}
          renderMessage={renderMessages}
          newMessagesFromNext={newMessagesFromNext}
          nextMessages={nextMessages}
          onTopReached={prev}
          onBottomReached={next}
          NewMessagesTooltip={NewMessagesTooltip}
          ScrollToBottomTooltip={ScrollToBottomTooltip}
        />
        <GroupChannelModule.Input
          onSendFileMessage={async (file) => {
            const params = new sdk.FileMessageParams();
            params.file = file;

            const processedParams = await onBeforeSendFileMessage(params);
            sendFileMessage(processedParams);
          }}
          onSendUserMessage={async (text) => {
            const params = new sdk.UserMessageParams();
            params.message = text;

            const processedParams = await onBeforeSendUserMessage(params);
            sendUserMessage(processedParams);
          }}
          channel={activeChannel}
        />
        {children}
      </GroupChannelModule.Provider>
    );
  };
};

export default createGroupChannelFragment;
