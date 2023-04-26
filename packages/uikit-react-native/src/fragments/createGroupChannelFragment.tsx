import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

import { useGroupChannelMessages } from '@sendbird/uikit-chat-hooks';
import {
  NOOP,
  PASS,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdUserMessage,
  messageComparator,
  useFreshCallback,
  useRefTracker,
} from '@sendbird/uikit-utils';

import MessageRenderer from '../components/MessageRenderer';
import NewMessagesButton from '../components/NewMessagesButton';
import ScrollToBottomButton from '../components/ScrollToBottomButton';
import StatusComposition from '../components/StatusComposition';
import { MESSAGE_FOCUS_ANIMATION_DELAY, MESSAGE_SEARCH_SAFE_SCROLL_DELAY } from '../constants';
import createGroupChannelModule from '../domain/groupChannel/module/createGroupChannelModule';
import type {
  GroupChannelFragment,
  GroupChannelModule,
  GroupChannelProps,
  GroupChannelPubSubContextPayload,
} from '../domain/groupChannel/types';
import { useSendbirdChat } from '../hooks/useContext';
import pubsub from '../utils/pubsub';

const createGroupChannelFragment = (initModule?: Partial<GroupChannelModule>): GroupChannelFragment => {
  const GroupChannelModule = createGroupChannelModule(initModule);

  return ({
    searchItem,
    renderNewMessagesButton = (props) => <NewMessagesButton {...props} />,
    renderScrollToBottomButton = (props) => <ScrollToBottomButton {...props} />,
    renderMessage,
    enableMessageGrouping = true,
    enableTypingIndicator = true,
    onPressHeaderLeft = NOOP,
    onPressHeaderRight = NOOP,
    onPressMediaMessage = NOOP,
    onChannelDeleted = NOOP,
    onBeforeSendUserMessage = PASS,
    onBeforeSendFileMessage = PASS,
    onBeforeUpdateUserMessage = PASS,
    onBeforeUpdateFileMessage = PASS,
    channel,
    keyboardAvoidOffset,
    queryCreator,
    collectionCreator,
    sortComparator = messageComparator,
    flatListProps,
    onPressImageMessage,
  }) => {
    const { sdk, currentUser } = useSendbirdChat();

    const [groupChannelPubSub] = useState(() => pubsub<GroupChannelPubSubContextPayload>());
    const [scrolledAwayFromBottom, setScrolledAwayFromBottom] = useState(false);
    const scrolledAwayFromBottomRef = useRefTracker(scrolledAwayFromBottom);

    const {
      loading,
      messages,
      newMessages,
      resetNewMessages,
      next,
      prev,
      hasNext,
      sendFileMessage,
      sendUserMessage,
      updateFileMessage,
      updateUserMessage,
      resendMessage,
      deleteMessage,
      resetWithStartingPoint,
    } = useGroupChannelMessages(sdk, channel, currentUser?.userId, {
      collectionCreator,
      queryCreator,
      sortComparator,
      onChannelDeleted,
      enableCollectionWithoutLocalCache: !queryCreator,
      shouldCountNewMessages: () => scrolledAwayFromBottomRef.current,
      onMessagesReceived(messages) {
        groupChannelPubSub.publish({ type: 'MESSAGES_RECEIVED', data: { messages } });
      },
      startingPoint: searchItem?.startingPoint,
    });

    const MessageComponent: GroupChannelProps['MessageList']['renderMessage'] = useCallback(
      withFocusingAnimation(renderMessage ? (props) => <>{renderMessage(props)}</> : MessageRenderer),
      [renderMessage],
    );

    const _renderMessage: GroupChannelProps['MessageList']['renderMessage'] = useFreshCallback((props) => {
      return <MessageComponent {...props} />;
    });

    const memoizedFlatListProps = useMemo(
      () => ({
        ListEmptyComponent: <GroupChannelModule.StatusEmpty />,
        contentContainerStyle: { flexGrow: 1 },
        ...flatListProps,
      }),
      [flatListProps],
    );

    const onResetMessageList = useCallback(
      (callback?: () => void) => resetWithStartingPoint(Number.MAX_SAFE_INTEGER, callback),
      [],
    );

    const onPending = (message: SendbirdFileMessage | SendbirdUserMessage) => {
      groupChannelPubSub.publish({ type: 'MESSAGE_SENT_PENDING', data: { message } });
    };

    const onSent = (message: SendbirdFileMessage | SendbirdUserMessage) => {
      groupChannelPubSub.publish({ type: 'MESSAGE_SENT_SUCCESS', data: { message } });
    };

    const onPressSendUserMessage: GroupChannelProps['Input']['onPressSendUserMessage'] = useFreshCallback(
      async (params) => {
        const processedParams = await onBeforeSendUserMessage(params);
        const message = await sendUserMessage(processedParams, onPending);
        onSent(message);
      },
    );
    const onPressSendFileMessage: GroupChannelProps['Input']['onPressSendFileMessage'] = useFreshCallback(
      async (params) => {
        const processedParams = await onBeforeSendFileMessage(params);
        const message = await sendFileMessage(processedParams, onPending);
        onSent(message);
      },
    );
    const onPressUpdateUserMessage: GroupChannelProps['Input']['onPressUpdateUserMessage'] = useFreshCallback(
      async (message, params) => {
        const processedParams = await onBeforeUpdateUserMessage(params);
        await updateUserMessage(message.messageId, processedParams);
      },
    );
    const onPressUpdateFileMessage: GroupChannelProps['Input']['onPressUpdateFileMessage'] = useFreshCallback(
      async (message, params) => {
        const processedParams = await onBeforeUpdateFileMessage(params);
        await updateFileMessage(message.messageId, processedParams);
      },
    );
    const onScrolledAwayFromBottom = useFreshCallback((value: boolean) => {
      if (!value) resetNewMessages();
      setScrolledAwayFromBottom(value);
    });

    /** @deprecated **/
    const onSendFileMessage: GroupChannelProps['Input']['onSendFileMessage'] = useFreshCallback(async (file) => {
      const processedParams = await onBeforeSendFileMessage({ file });
      const message = await sendFileMessage(processedParams, onPending);
      onSent(message);
    });
    /** @deprecated **/
    const onSendUserMessage: GroupChannelProps['Input']['onSendUserMessage'] = useFreshCallback(
      async (text, mention) => {
        const processedParams = await onBeforeSendUserMessage({
          message: text,
          mentionedUserIds: mention?.userIds,
          mentionedMessageTemplate: mention?.messageTemplate,
          mentionType: mention?.type,
        });
        const message = await sendUserMessage(processedParams, onPending);
        onSent(message);
      },
    );
    /** @deprecated **/
    const onUpdateFileMessage: GroupChannelProps['Input']['onUpdateFileMessage'] = useFreshCallback(
      async (editedFile, message) => {
        const processedParams = await onBeforeSendFileMessage({ file: editedFile });
        await updateFileMessage(message.messageId, processedParams);
      },
    );
    /** @deprecated **/
    const onUpdateUserMessage: GroupChannelProps['Input']['onUpdateUserMessage'] = useFreshCallback(
      async (editedText, message, mention) => {
        const processedParams = await onBeforeSendUserMessage({
          message: editedText,
          mentionedUserIds: mention?.userIds,
          mentionedMessageTemplate: mention?.messageTemplate,
          mentionType: mention?.type,
        });
        await updateUserMessage(message.messageId, processedParams);
      },
    );

    return (
      <GroupChannelModule.Provider
        channel={channel}
        groupChannelPubSub={groupChannelPubSub}
        enableTypingIndicator={enableTypingIndicator}
        keyboardAvoidOffset={keyboardAvoidOffset}
      >
        <GroupChannelModule.Header
          shouldHideRight={() => Boolean(searchItem)}
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={onPressHeaderRight}
        />
        <StatusComposition loading={loading} LoadingComponent={<GroupChannelModule.StatusLoading />}>
          <GroupChannelModule.MessageList
            channel={channel}
            searchItem={searchItem}
            onResetMessageList={onResetMessageList}
            enableMessageGrouping={enableMessageGrouping}
            currentUserId={currentUser?.userId}
            renderMessage={_renderMessage}
            messages={messages}
            newMessages={newMessages}
            onTopReached={prev}
            onBottomReached={next}
            hasNext={hasNext}
            scrolledAwayFromBottom={scrolledAwayFromBottom}
            onScrolledAwayFromBottom={onScrolledAwayFromBottom}
            renderNewMessagesButton={renderNewMessagesButton}
            renderScrollToBottomButton={renderScrollToBottomButton}
            onResendFailedMessage={resendMessage}
            onDeleteMessage={deleteMessage}
            onPressMediaMessage={onPressMediaMessage}
            flatListProps={memoizedFlatListProps}
            nextMessages={newMessages}
            newMessagesFromMembers={newMessages}
            onPressImageMessage={onPressImageMessage}
          />
          <GroupChannelModule.Input
            SuggestedMentionList={GroupChannelModule.SuggestedMentionList}
            shouldRenderInput={shouldRenderInput(channel)}
            onPressSendUserMessage={onPressSendUserMessage}
            onPressSendFileMessage={onPressSendFileMessage}
            onPressUpdateUserMessage={onPressUpdateUserMessage}
            onPressUpdateFileMessage={onPressUpdateFileMessage}
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

function shouldRenderInput(channel: SendbirdGroupChannel) {
  if (channel.isBroadcast) {
    return channel.myRole === 'operator';
  }

  return true;
}

function withFocusingAnimation<P extends unknown & { focused: boolean }>(Component: React.ComponentType<P>) {
  return React.memo<P>((props) => {
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (props.focused) {
        setTimeout(() => {
          Animated.sequence(
            [
              { toValue: -10, duration: 500 },
              { toValue: 0, duration: 100 },
              { toValue: -10, duration: 200 },
              { toValue: 0, duration: 100 },
            ].map((value) =>
              Animated.timing(translateY, { ...value, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
            ),
          ).start();
        }, MESSAGE_SEARCH_SAFE_SCROLL_DELAY + MESSAGE_FOCUS_ANIMATION_DELAY);
      }
    }, [props.focused]);

    return (
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Component {...props} />
      </Animated.View>
    );
  });
}

export default createGroupChannelFragment;
