import React, { useMemo } from 'react';

import { useOpenChannelMessages } from '@sendbird/uikit-chat-hooks';
import { NOOP, PASS, messageComparator, useFreshCallback } from '@sendbird/uikit-utils';

import OpenChannelMessageRenderer from '../components/OpenChannelMessageRenderer';
import ScrollToBottomButton from '../components/ScrollToBottomButton';
import StatusComposition from '../components/StatusComposition';
import { UNKNOWN_USER_ID } from '../constants';
import { createOpenChannelModule } from '../domain/openChannel';
import type { OpenChannelFragment, OpenChannelModule, OpenChannelProps } from '../domain/openChannel/types';
import { useSendbirdChat } from '../hooks/useContext';

const createOpenChannelFragment = (initModule?: Partial<OpenChannelModule>): OpenChannelFragment => {
  const OpenChannelModule = createOpenChannelModule(initModule);

  return ({
    renderNewMessagesButton = () => null,
    renderScrollToBottomButton = (props) => <ScrollToBottomButton {...props} />,
    renderMessage,
    enableMessageGrouping = true,
    onPressHeaderLeft = NOOP,
    onPressHeaderRightWithSettings = NOOP,
    onPressHeaderRightWithParticipants = NOOP,
    onPressMediaMessage = NOOP,
    onChannelDeleted = NOOP,
    onBeforeSendFileMessage = PASS,
    onBeforeSendUserMessage = PASS,
    channel,
    keyboardAvoidOffset,
    queryCreator,
    sortComparator = messageComparator,
    flatListProps,
  }) => {
    const { sdk, currentUser } = useSendbirdChat();
    const {
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
    } = useOpenChannelMessages(sdk, channel, currentUser?.userId, {
      queryCreator,
      sortComparator,
      onChannelDeleted,
    });

    const isOperator = channel.isOperator(currentUser?.userId ?? UNKNOWN_USER_ID);

    const _renderMessage: OpenChannelProps['MessageList']['renderMessage'] = useFreshCallback((props) => {
      if (renderMessage) return renderMessage(props);
      return <OpenChannelMessageRenderer {...props} />;
    });

    const memoizedFlatListProps = useMemo(
      () => ({
        ListEmptyComponent: <OpenChannelModule.StatusEmpty />,
        contentContainerStyle: { flexGrow: 1 },
        ...flatListProps,
      }),
      [loading, flatListProps],
    );

    const onSendFileMessage: OpenChannelProps['Input']['onSendFileMessage'] = useFreshCallback(async (file) => {
      const processedParams = await onBeforeSendFileMessage({ file });
      await sendFileMessage(processedParams);
    });
    const onSendUserMessage: OpenChannelProps['Input']['onSendUserMessage'] = useFreshCallback(async (text) => {
      const processedParams = await onBeforeSendUserMessage({ message: text });
      await sendUserMessage(processedParams);
    });
    const onUpdateFileMessage: OpenChannelProps['Input']['onUpdateFileMessage'] = useFreshCallback(
      async (editedFile, message) => {
        const processedParams = await onBeforeSendFileMessage({ file: editedFile });
        await updateFileMessage(message.messageId, processedParams);
      },
    );
    const onUpdateUserMessage: OpenChannelProps['Input']['onUpdateUserMessage'] = useFreshCallback(
      async (editedText, message) => {
        const processedParams = await onBeforeSendUserMessage({ message: editedText });
        await updateUserMessage(message.messageId, processedParams);
      },
    );

    return (
      <OpenChannelModule.Provider channel={channel} keyboardAvoidOffset={keyboardAvoidOffset}>
        <OpenChannelModule.Header
          onPressHeaderLeft={onPressHeaderLeft}
          rightIconName={isOperator ? 'info' : 'members'}
          onPressHeaderRight={isOperator ? onPressHeaderRightWithSettings : onPressHeaderRightWithParticipants}
        />
        <StatusComposition loading={loading} LoadingComponent={<OpenChannelModule.StatusLoading />}>
          <OpenChannelModule.MessageList
            channel={channel}
            enableMessageGrouping={enableMessageGrouping}
            currentUserId={currentUser?.userId}
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
            onPressMediaMessage={onPressMediaMessage}
            flatListProps={memoizedFlatListProps}
          />
          <OpenChannelModule.Input
            shouldRenderInput
            onSendFileMessage={onSendFileMessage}
            onSendUserMessage={onSendUserMessage}
            onUpdateFileMessage={onUpdateFileMessage}
            onUpdateUserMessage={onUpdateUserMessage}
          />
        </StatusComposition>
      </OpenChannelModule.Provider>
    );
  };
};

export default createOpenChannelFragment;
