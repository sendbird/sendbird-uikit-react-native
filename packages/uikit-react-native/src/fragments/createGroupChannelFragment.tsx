import React, { useCallback, useEffect, useMemo } from 'react';
import { View } from 'react-native';

import { useGroupChannelMessages } from '@sendbird/chat-react-hooks';
import { useInternalPubSub } from '@sendbird/chat-react-hooks';
import type { GroupChannelFragment, GroupChannelModule, GroupChannelProps } from '@sendbird/uikit-react-native-core';
import { createGroupChannelModule, useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { EmptyFunction, messageComparator } from '@sendbird/uikit-utils';

import MessageRenderer from '../ui/MessageRenderer';
import DefaultNewMessagesTooltip from '../ui/NewMessagesTooltip';
import DefaultScrollToBottomTooltip from '../ui/ScrollToBottomTooltip';
import TypedPlaceholder from '../ui/TypedPlaceholder';

const PassValue = <T,>(v: T) => v;

const createGroupChannelFragment = (initModule?: GroupChannelModule): GroupChannelFragment => {
  const GroupChannelModule = createGroupChannelModule(initModule);

  return ({
    NewMessagesTooltip = DefaultNewMessagesTooltip,
    ScrollToBottomTooltip = DefaultScrollToBottomTooltip,
    renderMessage,
    enableMessageGrouping = true,
    enableTypingIndicator = true,
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

    const _renderMessage: GroupChannelProps['MessageList']['renderMessage'] = useCallback(
      (props) => {
        if (renderMessage) return renderMessage(props);
        return <MessageRenderer {...props} />;
      },
      [renderMessage],
    );

    const memoizedFlatListProps = useMemo(
      () => ({
        ListEmptyComponent: (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TypedPlaceholder type={loading ? 'loading' : 'no-messages'} />
          </View>
        ),
        contentContainerStyle: { flexGrow: 1 },
        ...flatListProps,
      }),
      [loading, flatListProps],
    );

    const onSendFileMessage: GroupChannelProps['Input']['onSendFileMessage'] = useCallback(
      async (file) => {
        const params = new sdk.FileMessageParams();
        params.file = file;
        const processedParams = await onBeforeSendFileMessage(params);
        await sendFileMessage(processedParams);
      },
      [sdk, sendFileMessage, onBeforeSendFileMessage],
    );

    const onSendUserMessage: GroupChannelProps['Input']['onSendUserMessage'] = useCallback(
      async (text) => {
        const params = new sdk.UserMessageParams();
        params.message = text;
        const processedParams = await onBeforeSendUserMessage(params);
        await sendUserMessage(processedParams);
      },
      [sdk, sendUserMessage, onBeforeSendUserMessage],
    );
    const onUpdateFileMessage: GroupChannelProps['Input']['onUpdateFileMessage'] = useCallback(
      async (editedFile, message) => {
        const params = new sdk.FileMessageParams();
        params.file = editedFile;
        const processedParams = await onBeforeSendFileMessage(params);
        await updateFileMessage(message.messageId, processedParams);
      },
      [sdk, updateFileMessage, onBeforeSendFileMessage],
    );
    const onUpdateUserMessage: GroupChannelProps['Input']['onUpdateUserMessage'] = useCallback(
      async (editedText, message) => {
        const params = new sdk.UserMessageParams();
        params.message = editedText;
        const processedParams = await onBeforeSendUserMessage(params);
        await updateUserMessage(message.messageId, processedParams);
      },
      [sdk, updateUserMessage, onBeforeSendUserMessage],
    );

    return (
      <GroupChannelModule.Provider channel={activeChannel} enableTypingIndicator={enableTypingIndicator}>
        <GroupChannelModule.Header
          Header={Header}
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={onPressHeaderRight}
        />
        <GroupChannelModule.MessageList
          enableMessageGrouping={enableMessageGrouping}
          currentUserId={currentUser?.userId}
          channel={activeChannel}
          messages={messages}
          renderMessage={_renderMessage}
          newMessagesFromNext={newMessagesFromNext}
          nextMessages={nextMessages}
          onTopReached={prev}
          onBottomReached={next}
          NewMessagesTooltip={NewMessagesTooltip}
          ScrollToBottomTooltip={ScrollToBottomTooltip}
          onResendFailedMessage={resendMessage}
          onDeleteMessage={deleteMessage}
          onPressImageMessage={onPressImageMessage}
          flatListProps={memoizedFlatListProps}
        />
        <GroupChannelModule.Input
          channel={activeChannel}
          onSendFileMessage={onSendFileMessage}
          onSendUserMessage={onSendUserMessage}
          onUpdateFileMessage={onUpdateFileMessage}
          onUpdateUserMessage={onUpdateUserMessage}
        />
        {children}
      </GroupChannelModule.Provider>
    );
  };
};

export default createGroupChannelFragment;
