import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';

import { useGroupChannelMessages } from '@sendbird/chat-react-hooks';
import useInternalPubSub from '@sendbird/chat-react-hooks/src/common/useInternalPubSub';
import type { GroupChannelFragment, GroupChannelModule, GroupChannelProps } from '@sendbird/uikit-react-native-core';
import { createGroupChannelModule, useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { EmptyFunction, messageComparator } from '@sendbird/uikit-utils';

import DefaultMessageRenderer from '../ui/MessageRenderer';
import DefaultNewMessagesTooltip from '../ui/NewMessagesTooltip';
import DefaultScrollToBottomTooltip from '../ui/ScrollToBottomTooltip';
import TypedPlaceholder from '../ui/TypedPlaceholder';

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
    onPressImageMessage = EmptyFunction,
    onChannelDeleted = EmptyFunction,
    onBeforeSendFileMessage = PassValue,
    onBeforeSendUserMessage = PassValue,
    staleChannel,
    queryCreator,
    collectionCreator,
    sortComparator = messageComparator,
    flatListProps,
    children,
  }) => {
    const { sdk, currentUser } = useSendbirdChat();
    const { subscribe, events } = useInternalPubSub();

    const {
      activeChannel,
      messages,
      nextMessages,
      newMessagesFromNext,
      next,
      prev,
      sendFileMessage,
      sendUserMessage,
      updateFileMessage,
      updateUserMessage,
      resendMessage,
      deleteMessage,
      loading,
    } = useGroupChannelMessages(sdk, staleChannel, currentUser?.userId, {
      collectionCreator,
      queryCreator,
      sortComparator,
      enableCollectionWithoutLocalCache: true,
    });

    useEffect(() => {
      return subscribe(events.ChannelDeleted, ({ channelUrl }) => {
        if (channelUrl === activeChannel.url) onChannelDeleted();
      });
    }, [activeChannel.url]);

    const renderMessages: GroupChannelProps['MessageList']['renderMessage'] = useCallback(
      (message, prevMessage, nextMessage, onPress, onLongPress) => {
        return (
          <MessageRenderer
            channel={activeChannel}
            currentUserId={currentUser?.userId}
            message={message}
            prevMessage={prevMessage}
            nextMessage={nextMessage}
            enableMessageGrouping={enableMessageGrouping}
            onPressMessage={onPress}
            onLongPressMessage={onLongPress}
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
          currentUserId={currentUser?.userId}
          channel={activeChannel}
          messages={messages}
          renderMessage={renderMessages}
          newMessagesFromNext={newMessagesFromNext}
          nextMessages={nextMessages}
          onTopReached={prev}
          onBottomReached={next}
          NewMessagesTooltip={NewMessagesTooltip}
          ScrollToBottomTooltip={ScrollToBottomTooltip}
          onResendFailedMessage={resendMessage}
          onDeleteMessage={deleteMessage}
          onPressImageMessage={onPressImageMessage}
          flatListProps={{
            ListEmptyComponent: (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TypedPlaceholder type={loading ? 'loading' : 'no-messages'} />
              </View>
            ),
            contentContainerStyle: { flexGrow: 1 },
            ...flatListProps,
          }}
        />
        <GroupChannelModule.Input
          channel={activeChannel}
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
          onUpdateFileMessage={async (editedFile, message) => {
            const params = new sdk.FileMessageParams();
            params.file = editedFile;

            const processedParams = await onBeforeSendFileMessage(params);
            updateFileMessage(message.messageId, processedParams);
          }}
          onUpdateUserMessage={async (editedText, message) => {
            const params = new sdk.UserMessageParams();
            params.message = editedText;

            const processedParams = await onBeforeSendUserMessage(params);
            updateUserMessage(message.messageId, processedParams);
          }}
        />
        {children}
      </GroupChannelModule.Provider>
    );
  };
};

export default createGroupChannelFragment;
