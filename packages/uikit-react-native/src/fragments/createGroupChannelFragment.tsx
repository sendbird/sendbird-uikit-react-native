import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  type GroupChannel,
  GroupChannelEventSource,
  MessageCollection,
  MessageFilter,
} from '@sendbird/chat/groupChannel';
import { ReplyType } from '@sendbird/chat/message';
import { Box, useToast } from '@sendbird/uikit-react-native-foundation';
import { useGroupChannelMessages } from '@sendbird/uikit-tools';
import {
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdSendableMessage,
  SendbirdUserMessage,
  getReadableFileSize,
} from '@sendbird/uikit-utils';
import {
  NOOP,
  PASS,
  confirmAndMarkAsRead,
  messageComparator,
  useFreshCallback,
  useIIFE,
  useRefTracker,
} from '@sendbird/uikit-utils';

import GroupChannelMessageRenderer, {
  GroupChannelTypingIndicatorBubble,
} from '../components/GroupChannelMessageRenderer';
import NewMessagesButton from '../components/NewMessagesButton';
import ScrollToBottomButton from '../components/ScrollToBottomButton';
import StatusComposition from '../components/StatusComposition';
import UnreadMessagesFloating from '../components/UnreadMessagesFloating';
import createGroupChannelModule from '../domain/groupChannel/module/createGroupChannelModule';
import type {
  GroupChannelFragment,
  GroupChannelModule,
  GroupChannelProps,
  GroupChannelPubSubContextPayload,
} from '../domain/groupChannel/types';
import { useLocalization, usePlatformService, useSendbirdChat } from '../hooks/useContext';
import { FileType } from '../platform/types';
import pubsub from '../utils/pubsub';

const createGroupChannelFragment = (initModule?: Partial<GroupChannelModule>): GroupChannelFragment => {
  const GroupChannelModule = createGroupChannelModule(initModule);

  return ({
    searchItem,
    renderUnreadMessagesFloating = (props) => <UnreadMessagesFloating {...props} />,
    renderNewMessagesButton = (props) => <NewMessagesButton {...props} />,
    renderScrollToBottomButton = (props) => <ScrollToBottomButton {...props} />,
    renderMessage,
    enableMessageGrouping = true,
    enableTypingIndicator,
    onPressHeaderLeft = NOOP,
    onPressHeaderRight = NOOP,
    onPressMediaMessage = NOOP,
    onChannelDeleted = NOOP,
    onPressReplyMessageInThread = NOOP,
    onBeforeSendUserMessage = PASS,
    onBeforeSendFileMessage = PASS,
    onBeforeUpdateUserMessage = PASS,
    onBeforeUpdateFileMessage = PASS,
    channel,
    keyboardAvoidOffset,
    sortComparator = messageComparator,
    flatListComponent,
    flatListProps,
    messageListQueryParams,
    partialTextInputProps,
    collectionCreator,
  }) => {
    const { playerService, recorderService } = usePlatformService();
    const { sdk, currentUser, sbOptions, voiceMessageStatusManager } = useSendbirdChat();
    const toast = useToast();
    const { STRINGS } = useLocalization();

    const [internalSearchItem, setInternalSearchItem] = useState(searchItem);
    const navigateFromMessageSearch = useCallback(() => Boolean(searchItem), []);

    const [groupChannelPubSub] = useState(() => pubsub<GroupChannelPubSubContextPayload>());
    const [scrolledAwayFromBottom, setScrolledAwayFromBottom] = useState(false);
    const scrolledAwayFromBottomRef = useRefTracker(scrolledAwayFromBottom);

    const replyType = useIIFE(() => {
      if (sbOptions.uikit.groupChannel.channel.replyType === 'none') {
        return ReplyType.NONE;
      } else {
        return ReplyType.ONLY_REPLY_TO_CHANNEL;
      }
    });

    const [isNewLineExistInChannel, setIsNewLineExistInChannel] = useState(false);
    const hasSeenNewLineRef = useRef(false);
    const hasUserMarkedAsUnreadRef = useRef(false);

    useEffect(() => {
      setIsNewLineExistInChannel(channel.myLastRead < (channel.lastMessage?.createdAt ?? Number.MIN_SAFE_INTEGER));
    }, [channel.url]);

    const onNewLineSeenChange = useFreshCallback((hasSeenNewLine: boolean) => {
      hasSeenNewLineRef.current = hasSeenNewLine;
    });

    const onUserMarkedAsUnreadChange = useFreshCallback((hasUserMarkedAsUnread: boolean) => {
      hasUserMarkedAsUnreadRef.current = hasUserMarkedAsUnread;
    });

    const markAsRead = useFreshCallback((channels: GroupChannel[]) => {
      if (sbOptions.uikit.groupChannel.channel.enableMarkAsUnread) {
        if (
          !scrolledAwayFromBottom &&
          !hasUserMarkedAsUnreadRef.current &&
          (hasSeenNewLineRef.current || !isNewLineExistInChannel)
        ) {
          confirmAndMarkAsRead(channels, true);
        }
      } else {
        confirmAndMarkAsRead(channels);
      }
    });

    const {
      loading,
      messages,
      newMessages,
      resetNewMessages,
      loadNext,
      loadPrevious,
      hasNext,
      hasPrevious,
      sendFileMessage,
      sendUserMessage,
      updateFileMessage,
      updateUserMessage,
      resendMessage,
      deleteMessage,
      resetWithStartingPoint,
    } = useGroupChannelMessages(sdk, channel, {
      shouldCountNewMessages: () => scrolledAwayFromBottomRef.current,
      onMessagesReceived(messages) {
        groupChannelPubSub.publish({ type: 'MESSAGES_RECEIVED', data: { messages } });
      },
      onMessagesUpdated(messages) {
        groupChannelPubSub.publish({ type: 'MESSAGES_UPDATED', data: { messages } });
      },
      onChannelUpdated(_, ctx) {
        if (ctx?.source === GroupChannelEventSource.EVENT_CHANNEL_READ) {
          if (ctx.userIds.includes(currentUser?.userId ?? '')) {
            groupChannelPubSub.publish({ type: 'ON_MARKED_AS_READ_BY_CURRENT_USER' });
          }
        } else if (ctx?.source === GroupChannelEventSource.EVENT_CHANNEL_UNREAD) {
          if (ctx.userIds.includes(currentUser?.userId ?? '')) {
            setIsNewLineExistInChannel(true);
            groupChannelPubSub.publish({ type: 'ON_MARKED_AS_UNREAD_BY_CURRENT_USER' });
          }
        }
      },
      onChannelDeleted,
      onCurrentUserBanned: onChannelDeleted,
      collectionCreator: getCollectionCreator(channel, messageListQueryParams, collectionCreator),
      sortComparator,
      markAsRead: markAsRead,
      replyType,
      startingPoint: internalSearchItem?.startingPoint,
    });

    const onBlurFragment = async () => {
      await playerService.reset().catch(() => {});
      await recorderService.reset().catch(() => {});
    };
    const _onPressHeaderLeft = useFreshCallback(async () => {
      await onBlurFragment();
      onPressHeaderLeft();
    });
    const _onPressHeaderRight = useFreshCallback(async () => {
      await onBlurFragment();
      onPressHeaderRight();
    });
    const _onPressMediaMessage: NonNullable<GroupChannelProps['MessageList']['onPressMediaMessage']> = useFreshCallback(
      async (message, deleteMessage, uri) => {
        await onBlurFragment();
        onPressMediaMessage(message, deleteMessage, uri);
      },
    );
    const _onPressReplyMessageInThread = useFreshCallback(
      async (message: SendbirdSendableMessage, startingPoint?: number) => {
        await onBlurFragment();
        onPressReplyMessageInThread(message, startingPoint);
      },
    );

    useEffect(() => {
      return () => {
        voiceMessageStatusManager.clear();
        onBlurFragment();
      };
    }, []);

    const renderItem: GroupChannelProps['MessageList']['renderMessage'] = useFreshCallback((props) => {
      const content = renderMessage ? renderMessage(props) : <GroupChannelMessageRenderer {...props} />;
      return (
        <Box>
          {content}
          {props.isFirstItem && !hasNext() && <GroupChannelTypingIndicatorBubble />}
        </Box>
      );
    });

    const memoizedFlatListProps = useMemo(
      () => ({
        ListEmptyComponent: <GroupChannelModule.StatusEmpty />,
        contentContainerStyle: { flexGrow: 1 },
        ...flatListProps,
      }),
      [flatListProps],
    );

    const onResetMessageList = useCallback(async () => {
      return await resetWithStartingPoint(Number.MAX_SAFE_INTEGER);
    }, []);

    const onResetMessageListWithStartingPoint = useCallback(async (startingPoint: number) => {
      return await resetWithStartingPoint(startingPoint);
    }, []);

    // Changing the search item will trigger the focus animation on messages.
    const onUpdateSearchItem: GroupChannelProps['MessageList']['onUpdateSearchItem'] = useCallback((searchItem) => {
      // Clean up for animation trigger with useEffect
      setInternalSearchItem(undefined);
      setInternalSearchItem(searchItem);
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
        const fileSize = (processedParams.file as FileType)?.size ?? processedParams.fileSize;
        const uploadSizeLimit = sbOptions.appInfo.uploadSizeLimit;

        if (fileSize && uploadSizeLimit && fileSize > uploadSizeLimit) {
          const sizeLimitString = `${getReadableFileSize(uploadSizeLimit)}`;
          toast.show(STRINGS.TOAST.FILE_UPLOAD_SIZE_LIMIT_EXCEEDED_ERROR(sizeLimitString), 'error');
          return;
        } else {
          const message = await sendFileMessage(processedParams, onPending);
          onSent(message);
        }
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
      if (!value) {
        resetNewMessages();
        if (sbOptions.uikit.groupChannel.channel.enableMarkAsUnread) {
          if (!hasUserMarkedAsUnreadRef.current && (hasSeenNewLineRef.current || !isNewLineExistInChannel)) {
            confirmAndMarkAsRead([channel]);
          }
        }
      }
      setScrolledAwayFromBottom(value);
    });

    return (
      <GroupChannelModule.Provider
        channel={channel}
        groupChannelPubSub={groupChannelPubSub}
        enableTypingIndicator={enableTypingIndicator ?? sbOptions.uikit.groupChannel.channel.enableTypingIndicator}
        keyboardAvoidOffset={keyboardAvoidOffset}
        messages={messages}
        onUpdateSearchItem={onUpdateSearchItem}
        onPressReplyMessageInThread={_onPressReplyMessageInThread}
      >
        <GroupChannelModule.Header
          shouldHideRight={navigateFromMessageSearch}
          onPressHeaderLeft={_onPressHeaderLeft}
          onPressHeaderRight={_onPressHeaderRight}
        />
        <StatusComposition loading={loading} LoadingComponent={<GroupChannelModule.StatusLoading />}>
          <GroupChannelModule.MessageList
            channel={channel}
            searchItem={internalSearchItem}
            onResetMessageList={onResetMessageList}
            onResetMessageListWithStartingPoint={onResetMessageListWithStartingPoint}
            onUpdateSearchItem={onUpdateSearchItem}
            enableMessageGrouping={enableMessageGrouping}
            currentUserId={currentUser?.userId}
            renderMessage={renderItem}
            messages={messages}
            newMessages={newMessages}
            onTopReached={loadPrevious}
            onBottomReached={loadNext}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            resetNewMessages={resetNewMessages}
            scrolledAwayFromBottom={scrolledAwayFromBottom}
            onScrolledAwayFromBottom={onScrolledAwayFromBottom}
            renderNewMessagesButton={renderNewMessagesButton}
            renderScrollToBottomButton={renderScrollToBottomButton}
            renderUnreadMessagesFloating={renderUnreadMessagesFloating}
            onResendFailedMessage={resendMessage}
            onDeleteMessage={deleteMessage}
            onPressMediaMessage={_onPressMediaMessage}
            flatListComponent={flatListComponent}
            flatListProps={memoizedFlatListProps}
            isNewLineExistInChannel={isNewLineExistInChannel}
            onNewLineSeenChange={onNewLineSeenChange}
            onUserMarkedAsUnreadChange={onUserMarkedAsUnreadChange}
          />
          <GroupChannelModule.Input
            SuggestedMentionList={GroupChannelModule.SuggestedMentionList}
            shouldRenderInput={shouldRenderInput(channel)}
            onPressSendUserMessage={onPressSendUserMessage}
            onPressSendFileMessage={onPressSendFileMessage}
            onPressUpdateUserMessage={onPressUpdateUserMessage}
            onPressUpdateFileMessage={onPressUpdateFileMessage}
            partialTextInputProps={partialTextInputProps}
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

function getCollectionCreator(
  channel: SendbirdGroupChannel,
  messageListQueryParams?: GroupChannelProps['Fragment']['messageListQueryParams'],
  deprecatedCreatorProp?: () => MessageCollection,
) {
  if (!messageListQueryParams && deprecatedCreatorProp) return deprecatedCreatorProp;

  return (defaultParams: GroupChannelProps['Fragment']['messageListQueryParams']) => {
    const params = { ...defaultParams, ...messageListQueryParams };
    return channel.createMessageCollection({
      ...params,
      filter: new MessageFilter(params),
    });
  };
}

export default createGroupChannelFragment;
