import React, { useCallback, useMemo } from 'react';

import { useGroupChannelMessages } from '@sendbird/uikit-chat-hooks';
import { NOOP, PASS, messageComparator } from '@sendbird/uikit-utils';

import MessageRenderer from '../components/MessageRenderer';
import DefaultNewMessagesTooltip from '../components/NewMessagesTooltip';
import DefaultScrollToBottomTooltip from '../components/ScrollToBottomTooltip';
import StatusComposition from '../components/StatusComposition';
import createGroupChannelModule from '../domain/groupChannel/module/createGroupChannelModule';
import type { GroupChannelFragment, GroupChannelModule, GroupChannelProps } from '../domain/groupChannel/types';
import { useSendbirdChat } from '../hooks/useContext';

const createGroupChannelFragment = (initModule?: Partial<GroupChannelModule>): GroupChannelFragment => {
  const GroupChannelModule = createGroupChannelModule(initModule);

  return ({
    renderNewMessagesTooltip = (props) => <DefaultNewMessagesTooltip {...props} />,
    renderScrollToBottomTooltip = (props) => <DefaultScrollToBottomTooltip {...props} />,
    renderMessage,
    enableMessageGrouping = true,
    enableTypingIndicator = true,
    onPressHeaderLeft = NOOP,
    onPressHeaderRight = NOOP,
    onPressImageMessage = NOOP,
    onChannelDeleted = NOOP,
    onBeforeSendFileMessage = PASS,
    onBeforeSendUserMessage = PASS,
    staleChannel,
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
      onChannelDeleted,
      enableCollectionWithoutLocalCache: true,
    });

    const _renderMessage: GroupChannelProps['MessageList']['renderMessage'] = useCallback(
      (props) => {
        if (renderMessage) return renderMessage(props);
        return <MessageRenderer {...props} />;
      },
      [renderMessage],
    );

    const memoizedFlatListProps = useMemo(
      () => ({
        ListEmptyComponent: <GroupChannelModule.StatusEmpty />,
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
            newMessagesFromNext={newMessagesFromNext}
            onTopReached={prev}
            onBottomReached={next}
            renderNewMessagesTooltip={renderNewMessagesTooltip}
            renderScrollToBottomTooltip={renderScrollToBottomTooltip}
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
        </StatusComposition>
      </GroupChannelModule.Provider>
    );
  };
};

export default createGroupChannelFragment;
