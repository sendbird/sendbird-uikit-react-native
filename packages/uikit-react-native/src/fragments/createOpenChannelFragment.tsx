import React, { useMemo } from 'react';

import { SendbirdError } from '@sendbird/chat';
import { useOpenChannelMessages } from '@sendbird/uikit-chat-hooks';
import { useToast } from '@sendbird/uikit-react-native-foundation';
import { NOOP, PASS, SBErrorCode, messageComparator, useFreshCallback } from '@sendbird/uikit-utils';

import OpenChannelMessageRenderer from '../components/OpenChannelMessageRenderer';
import ScrollToBottomButton from '../components/ScrollToBottomButton';
import StatusComposition from '../components/StatusComposition';
import { UNKNOWN_USER_ID } from '../constants';
import { createOpenChannelModule } from '../domain/openChannel';
import type { OpenChannelFragment, OpenChannelModule, OpenChannelProps } from '../domain/openChannel/types';
import { useLocalization, useSendbirdChat, useUserProfile } from '../hooks/useContext';

const createOpenChannelFragment = (initModule?: Partial<OpenChannelModule>): OpenChannelFragment => {
  const OpenChannelModule = createOpenChannelModule(initModule);

  return ({
    channel,
    onChannelDeleted = NOOP,
    onPressHeaderLeft = NOOP,
    onPressHeaderRightWithSettings = NOOP,
    onPressHeaderRightWithParticipants = NOOP,

    onBeforeSendUserMessage = PASS,
    onBeforeSendFileMessage = PASS,
    onBeforeUpdateUserMessage = PASS,
    onBeforeUpdateFileMessage = PASS,
    onPressMediaMessage = NOOP,

    renderMessage,
    renderNewMessagesButton = () => null,
    renderScrollToBottomButton = (props) => <ScrollToBottomButton {...props} />,

    enableMessageGrouping = true,
    keyboardAvoidOffset,
    flatListProps,
    queryCreator,
    sortComparator = messageComparator,
  }) => {
    const { sdk, currentUser } = useSendbirdChat();
    const { STRINGS } = useLocalization();
    const { show: showToast } = useToast();
    const { show: showUserProfile } = useUserProfile();

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
      onError(error) {
        if (error instanceof SendbirdError) {
          switch (error.code) {
            case SBErrorCode.CHANNEL_NOT_FOUND_SDK:
            case SBErrorCode.CHANNEL_NOT_FOUND_SERVER: {
              return showToast(STRINGS.TOAST.GET_CHANNEL_ERROR, 'error');
            }
          }
        }

        showToast(STRINGS.TOAST.UNKNOWN_ERROR, 'error');
      },
    });

    const isOperator = channel.isOperator(currentUser?.userId ?? UNKNOWN_USER_ID);

    const _renderMessage: OpenChannelProps['MessageList']['renderMessage'] = useFreshCallback((props) => {
      if (renderMessage) return renderMessage(props);
      return <OpenChannelMessageRenderer {...props} onPressAvatar={showUserProfile} />;
    });

    const memoizedFlatListProps = useMemo(
      () => ({
        ListEmptyComponent: <OpenChannelModule.StatusEmpty />,
        contentContainerStyle: { flexGrow: 1 },
        ...flatListProps,
      }),
      [loading, flatListProps],
    );

    const onPressSendUserMessage: OpenChannelProps['Input']['onPressSendUserMessage'] = useFreshCallback(
      async (params) => {
        const processedParams = await onBeforeSendUserMessage(params);
        await sendUserMessage(processedParams);
      },
    );
    const onPressSendFileMessage: OpenChannelProps['Input']['onPressSendFileMessage'] = useFreshCallback(
      async (params) => {
        const processedParams = await onBeforeSendFileMessage(params);
        await sendFileMessage(processedParams);
      },
    );
    const onPressUpdateUserMessage: OpenChannelProps['Input']['onPressUpdateUserMessage'] = useFreshCallback(
      async (message, params) => {
        const processedParams = await onBeforeUpdateUserMessage(params);
        await updateUserMessage(message.messageId, processedParams);
      },
    );
    const onPressUpdateFileMessage: OpenChannelProps['Input']['onPressUpdateFileMessage'] = useFreshCallback(
      async (message, params) => {
        const processedParams = await onBeforeUpdateFileMessage(params);
        await updateFileMessage(message.messageId, processedParams);
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
            onPressSendUserMessage={onPressSendUserMessage}
            onPressSendFileMessage={onPressSendFileMessage}
            onPressUpdateUserMessage={onPressUpdateUserMessage}
            onPressUpdateFileMessage={onPressUpdateFileMessage}
          />
        </StatusComposition>
      </OpenChannelModule.Provider>
    );
  };
};

export default createOpenChannelFragment;
