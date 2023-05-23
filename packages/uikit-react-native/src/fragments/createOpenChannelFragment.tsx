import React, { useMemo, useState } from 'react';

import { SendbirdError } from '@sendbird/chat';
import { useOpenChannelMessages } from '@sendbird/uikit-chat-hooks';
import { useToast } from '@sendbird/uikit-react-native-foundation';
import {
  NOOP,
  PASS,
  SBErrorCode,
  SendbirdFileMessage,
  SendbirdUserMessage,
  messageComparator,
  useFreshCallback,
} from '@sendbird/uikit-utils';

import OpenChannelMessageRenderer from '../components/OpenChannelMessageRenderer';
import ScrollToBottomButton from '../components/ScrollToBottomButton';
import StatusComposition from '../components/StatusComposition';
import { UNKNOWN_USER_ID } from '../constants';
import { createOpenChannelModule } from '../domain/openChannel';
import type {
  OpenChannelFragment,
  OpenChannelModule,
  OpenChannelProps,
  OpenChannelPubSubContextPayload,
} from '../domain/openChannel/types';
import { useLocalization, useSendbirdChat } from '../hooks/useContext';
import pubsub from '../utils/pubsub';

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

    const [openChannelPubSub] = useState(() => pubsub<OpenChannelPubSubContextPayload>());

    const {
      messages,
      newMessages,
      next,
      prev,
      hasNext,
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
            case SBErrorCode.RESOURCE_NOT_FOUND:
            case SBErrorCode.CHANNEL_NOT_FOUND:
            case SBErrorCode.BANNED_USER_SEND_MESSAGE_NOT_ALLOWED: {
              return showToast(STRINGS.TOAST.GET_CHANNEL_ERROR, 'error');
            }
          }
        }

        showToast(STRINGS.TOAST.UNKNOWN_ERROR, 'error');
      },
      onMessagesReceived(messages) {
        openChannelPubSub.publish({ type: 'MESSAGES_RECEIVED', data: { messages } });
      },
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

    const onPending = (message: SendbirdFileMessage | SendbirdUserMessage) => {
      openChannelPubSub.publish({ type: 'MESSAGE_SENT_PENDING', data: { message } });
    };
    const onSent = (message: SendbirdFileMessage | SendbirdUserMessage) => {
      openChannelPubSub.publish({ type: 'MESSAGE_SENT_SUCCESS', data: { message } });
    };

    const onPressSendUserMessage: OpenChannelProps['Input']['onPressSendUserMessage'] = useFreshCallback(
      async (params) => {
        const processedParams = await onBeforeSendUserMessage(params);
        const message = await sendUserMessage(processedParams, onPending);
        onSent(message);
      },
    );
    const onPressSendFileMessage: OpenChannelProps['Input']['onPressSendFileMessage'] = useFreshCallback(
      async (params) => {
        const processedParams = await onBeforeSendFileMessage(params);
        const message = await sendFileMessage(processedParams, onPending);
        onSent(message);
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
      <OpenChannelModule.Provider
        openChannelPubSub={openChannelPubSub}
        channel={channel}
        keyboardAvoidOffset={keyboardAvoidOffset}
      >
        <OpenChannelModule.Header
          onPressHeaderLeft={onPressHeaderLeft}
          rightIconName={isOperator ? 'info' : 'members'}
          onPressHeaderRight={isOperator ? onPressHeaderRightWithSettings : onPressHeaderRightWithParticipants}
        />
        <StatusComposition loading={loading} LoadingComponent={<OpenChannelModule.StatusLoading />}>
          <OpenChannelModule.MessageList
            channel={channel}
            hasNext={hasNext}
            enableMessageGrouping={enableMessageGrouping}
            currentUserId={currentUser?.userId}
            renderMessage={_renderMessage}
            messages={messages}
            newMessages={newMessages}
            onTopReached={prev}
            onBottomReached={next}
            scrolledAwayFromBottom={false}
            onScrolledAwayFromBottom={NOOP}
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
