import React, { useCallback, useMemo, useState } from 'react';

import { ReplyType } from '@sendbird/chat/message';
import { useGroupChannelMessages } from '@sendbird/uikit-chat-hooks';
import {
  NOOP,
  PASS,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdUserMessage,
  messageComparator,
  useFreshCallback,
  useIIFE,
  useRefTracker,
} from '@sendbird/uikit-utils';

import GroupChannelMessageRenderer from '../components/GroupChannelMessageRenderer';
import NewMessagesButton from '../components/NewMessagesButton';
import ScrollToBottomButton from '../components/ScrollToBottomButton';
import StatusComposition from '../components/StatusComposition';
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
    enableTypingIndicator,
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
    collectionCreator,
    sortComparator = messageComparator,
    flatListProps,
  }) => {
    const { sdk, currentUser, sbOptions } = useSendbirdChat();

    const [internalSearchItem, setInternalSearchItem] = useState(searchItem);
    const navigateFromMessageSearch = useCallback(() => Boolean(searchItem), []);

    const [groupChannelPubSub] = useState(() => pubsub<GroupChannelPubSubContextPayload>());
    const [scrolledAwayFromBottom, setScrolledAwayFromBottom] = useState(false);
    const scrolledAwayFromBottomRef = useRefTracker(scrolledAwayFromBottom);

    const replyType = useIIFE(() => {
      if (sbOptions.uikit.groupChannel.channel.replyType === 'none') return ReplyType.NONE;
      else return ReplyType.ONLY_REPLY_TO_CHANNEL;
    });

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
      shouldCountNewMessages: () => scrolledAwayFromBottomRef.current,
      onMessagesReceived(messages) {
        groupChannelPubSub.publish({ type: 'MESSAGES_RECEIVED', data: { messages } });
      },
      collectionCreator,
      sortComparator,
      onChannelDeleted,
      replyType,
      startingPoint: internalSearchItem?.startingPoint,
      enableCollectionWithoutLocalCache: true,
    });

    const renderItem: GroupChannelProps['MessageList']['renderMessage'] = useFreshCallback((props) => {
      if (renderMessage) return renderMessage(props);
      return <GroupChannelMessageRenderer {...props} />;
    });

    const memoizedFlatListProps = useMemo(
      () => ({
        ListEmptyComponent: <GroupChannelModule.StatusEmpty />,
        contentContainerStyle: { flexGrow: 1 },
        ...flatListProps,
      }),
      [flatListProps],
    );

    const onResetMessageList = useCallback((callback?: () => void) => {
      resetWithStartingPoint(Number.MAX_SAFE_INTEGER, callback);
      setInternalSearchItem(undefined);
    }, []);

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

    return (
      <GroupChannelModule.Provider
        channel={channel}
        groupChannelPubSub={groupChannelPubSub}
        enableTypingIndicator={enableTypingIndicator ?? sbOptions.uikit.groupChannel.channel.enableTypingIndicator}
        keyboardAvoidOffset={keyboardAvoidOffset}
      >
        <GroupChannelModule.Header
          shouldHideRight={navigateFromMessageSearch}
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={onPressHeaderRight}
        />
        <StatusComposition loading={loading} LoadingComponent={<GroupChannelModule.StatusLoading />}>
          <GroupChannelModule.MessageList
            channel={channel}
            searchItem={internalSearchItem}
            onResetMessageList={onResetMessageList}
            enableMessageGrouping={enableMessageGrouping}
            currentUserId={currentUser?.userId}
            renderMessage={renderItem}
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
          />
          <GroupChannelModule.Input
            SuggestedMentionList={GroupChannelModule.SuggestedMentionList}
            shouldRenderInput={shouldRenderInput(channel)}
            onPressSendUserMessage={onPressSendUserMessage}
            onPressSendFileMessage={onPressSendFileMessage}
            onPressUpdateUserMessage={onPressUpdateUserMessage}
            onPressUpdateFileMessage={onPressUpdateFileMessage}
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

export default createGroupChannelFragment;
