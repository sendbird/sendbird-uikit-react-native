import React, { useMemo } from 'react';

import { useGroupChannelMessages } from '@sendbird/uikit-chat-hooks';
import { NOOP, PASS, messageComparator, useFreshCallback } from '@sendbird/uikit-utils';

import MessageRenderer from '../components/MessageRenderer';
import NewMessagesButton from '../components/NewMessagesButton';
import ScrollToBottomButton from '../components/ScrollToBottomButton';
import StatusComposition from '../components/StatusComposition';
import createGroupChannelModule from '../domain/groupChannel/module/createGroupChannelModule';
import type { GroupChannelFragment, GroupChannelModule, GroupChannelProps } from '../domain/groupChannel/types';
import { useSendbirdChat } from '../hooks/useContext';

const createGroupChannelFragment = (initModule?: Partial<GroupChannelModule>): GroupChannelFragment => {
  const GroupChannelModule = createGroupChannelModule(initModule);

  return ({
    renderNewMessagesButton = (props) => <NewMessagesButton {...props} />,
    renderScrollToBottomButton = (props) => <ScrollToBottomButton {...props} />,
    renderMessage,
    enableMessageGrouping = true,
    enableTypingIndicator = true,
    onPressHeaderLeft = NOOP,
    onPressHeaderRight = NOOP,
    onPressImageMessage,
    onPressMediaMessage = NOOP,
    onChannelDeleted = NOOP,
    onBeforeSendFileMessage = PASS,
    onBeforeSendUserMessage = PASS,
    channel,
    keyboardAvoidOffset,
    queryCreator,
    collectionCreator,
    sortComparator = messageComparator,
    flatListProps,
  }) => {
    const { sdk, currentUser } = useSendbirdChat();

    const {
      activeChannel,
      messages,
      nextMessages,
      newMessagesFromMembers,
      next,
      prev,
      sendFileMessage,
      sendUserMessage,
      updateFileMessage,
      updateUserMessage,
      resendMessage,
      deleteMessage,
      loading,
    } = useGroupChannelMessages(sdk, channel, currentUser?.userId, {
      collectionCreator,
      queryCreator,
      sortComparator,
      onChannelDeleted,
      enableCollectionWithoutLocalCache: !queryCreator,
    });

    const _renderMessage: GroupChannelProps['MessageList']['renderMessage'] = useFreshCallback((props) => {
      if (renderMessage) return renderMessage(props);
      return <MessageRenderer {...props} />;
    });

    const memoizedFlatListProps = useMemo(
      () => ({
        ListEmptyComponent: <GroupChannelModule.StatusEmpty />,
        contentContainerStyle: { flexGrow: 1 },
        ...flatListProps,
      }),
      [loading, flatListProps],
    );

    const onSendFileMessage: GroupChannelProps['Input']['onSendFileMessage'] = useFreshCallback(async (file) => {
      const processedParams = await onBeforeSendFileMessage({ file });
      await sendFileMessage(processedParams);
    });
    const onSendUserMessage: GroupChannelProps['Input']['onSendUserMessage'] = useFreshCallback(async (text) => {
      const processedParams = await onBeforeSendUserMessage({ message: text });
      await sendUserMessage(processedParams);
    });
    const onUpdateFileMessage: GroupChannelProps['Input']['onUpdateFileMessage'] = useFreshCallback(
      async (editedFile, message) => {
        const processedParams = await onBeforeSendFileMessage({ file: editedFile });
        await updateFileMessage(message.messageId, processedParams);
      },
    );
    const onUpdateUserMessage: GroupChannelProps['Input']['onUpdateUserMessage'] = useFreshCallback(
      async (editedText, message) => {
        const processedParams = await onBeforeSendUserMessage({ message: editedText });
        await updateUserMessage(message.messageId, processedParams);
      },
    );

    return (
      <GroupChannelModule.Provider
        channel={activeChannel}
        enableTypingIndicator={enableTypingIndicator}
        keyboardAvoidOffset={keyboardAvoidOffset}
      >
        <GroupChannelModule.Header onPressHeaderLeft={onPressHeaderLeft} onPressHeaderRight={onPressHeaderRight} />
        <StatusComposition loading={loading} LoadingComponent={<GroupChannelModule.StatusLoading />}>
          <GroupChannelModule.MessageList
            enableMessageGrouping={enableMessageGrouping}
            currentUserId={currentUser?.userId}
            channel={activeChannel}
            renderMessage={_renderMessage}
            messages={messages}
            nextMessages={nextMessages}
            newMessagesFromMembers={newMessagesFromMembers}
            onTopReached={prev}
            onBottomReached={next}
            renderNewMessagesButton={renderNewMessagesButton}
            renderScrollToBottomButton={renderScrollToBottomButton}
            onResendFailedMessage={resendMessage}
            onDeleteMessage={deleteMessage}
            onPressImageMessage={onPressImageMessage}
            onPressMediaMessage={onPressMediaMessage}
            flatListProps={memoizedFlatListProps}
          />
          <GroupChannelModule.Input
            channel={activeChannel}
            onSendFileMessage={onSendFileMessage}
            onSendUserMessage={onSendUserMessage}
            onUpdateFileMessage={onUpdateFileMessage}
            onUpdateUserMessage={onUpdateUserMessage}
          />
        </StatusComposition>
      </GroupChannelModule.Provider>
    );
  };
};

export default createGroupChannelFragment;
