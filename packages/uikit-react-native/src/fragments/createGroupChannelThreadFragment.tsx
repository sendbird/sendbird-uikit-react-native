import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Box, useToast } from '@sendbird/uikit-react-native-foundation';
import { useGroupChannelThreadMessages } from '@sendbird/uikit-tools';
import {
  SendbirdFileMessage,
  SendbirdGroupChannel,
  type SendbirdMessage,
  SendbirdUserMessage,
  getReadableFileSize,
} from '@sendbird/uikit-utils';
import {
  NOOP,
  PASS,
  confirmAndMarkAsRead,
  messageComparator,
  useFreshCallback,
  useRefTracker,
} from '@sendbird/uikit-utils';

import GroupChannelMessageRenderer from '../components/GroupChannelMessageRenderer';
import StatusComposition from '../components/StatusComposition';
import createGroupChannelThreadModule from '../domain/groupChannelThread/module/createGroupChannelThreadModule';
import type {
  GroupChannelThreadFragment,
  GroupChannelThreadModule,
  GroupChannelThreadProps,
  GroupChannelThreadPubSubContextPayload,
} from '../domain/groupChannelThread/types';
import { useLocalization, usePlatformService, useSendbirdChat } from '../hooks/useContext';
import pubsub from '../utils/pubsub';

const createGroupChannelThreadFragment = (
  initModule?: Partial<GroupChannelThreadModule>,
): GroupChannelThreadFragment => {
  const GroupChannelThreadModule = createGroupChannelThreadModule(initModule);

  return ({
    renderMessage,
    enableMessageGrouping = true,
    onPressHeaderLeft = NOOP,
    onPressHeaderSubtitle = NOOP,
    onPressMediaMessage = NOOP,
    onParentMessageDeleted = NOOP,
    onChannelDeleted = NOOP,
    onBeforeSendUserMessage = PASS,
    onBeforeSendFileMessage = PASS,
    onBeforeUpdateUserMessage = PASS,
    onBeforeUpdateFileMessage = PASS,
    channel,
    parentMessage,
    startingPoint,
    keyboardAvoidOffset,
    sortComparator = threadMessageComparator,
    flatListProps,
  }) => {
    const { playerService, recorderService } = usePlatformService();
    const { sdk, currentUser, sbOptions, voiceMessageStatusManager, groupChannelFragmentOptions } = useSendbirdChat();

    const [groupChannelThreadPubSub] = useState(() => pubsub<GroupChannelThreadPubSubContextPayload>());
    const [scrolledAwayFromBottom, setScrolledAwayFromBottom] = useState(false);
    const scrolledAwayFromBottomRef = useRefTracker(scrolledAwayFromBottom);

    const toast = useToast();
    const { STRINGS } = useLocalization();
    const [_parentMessage, setParentMessage] = useState(parentMessage);

    const {
      loading,
      messages,
      newMessages,
      resetNewMessages,
      loadNext,
      loadPrevious,
      hasNext,
      sendFileMessage,
      sendUserMessage,
      updateFileMessage,
      updateUserMessage,
      resendMessage,
      deleteMessage,
      resetWithStartingPoint,
    } = useGroupChannelThreadMessages(sdk, channel, _parentMessage, {
      shouldCountNewMessages: () => scrolledAwayFromBottomRef.current,
      onMessagesReceived(messages) {
        groupChannelThreadPubSub.publish({ type: 'MESSAGES_RECEIVED', data: { messages } });
      },
      onMessagesUpdated(messages) {
        groupChannelThreadPubSub.publish({ type: 'MESSAGES_UPDATED', data: { messages } });
      },
      onParentMessageUpdated(parentMessage) {
        setParentMessage(parentMessage);
      },
      onParentMessageDeleted: () => {
        toast.show(STRINGS.TOAST.THREAD_PARENT_MESSAGE_DELETED_ERROR, 'error');
        onParentMessageDeleted?.();
      },
      onChannelDeleted,
      onCurrentUserBanned: onChannelDeleted,
      sortComparator,
      markAsRead: confirmAndMarkAsRead,
      isReactionEnabled: sbOptions.uikit.groupChannel.channel.enableReactions,
      startingPoint,
    });

    const onBlurFragment = () => {
      return Promise.allSettled([playerService.reset(), recorderService.reset()]);
    };
    const _onPressHeaderLeft = useFreshCallback(async () => {
      await onBlurFragment();
      voiceMessageStatusManager.publishAll();
      onPressHeaderLeft();
    });
    const _onPressHeaderSubtitle = useFreshCallback(async () => {
      await onBlurFragment();
      voiceMessageStatusManager.publishAll();
      groupChannelFragmentOptions.pubsub.publish({
        type: 'OVERRIDE_SEARCH_ITEM_STARTING_POINT',
        data: { startingPoint: parentMessage.createdAt },
      });
      onPressHeaderSubtitle();
    });
    const _onPressMediaMessage: NonNullable<GroupChannelThreadProps['MessageList']['onPressMediaMessage']> =
      useFreshCallback(async (message, deleteMessage, uri) => {
        await onBlurFragment();
        onPressMediaMessage(message, deleteMessage, uri);
      });

    useEffect(() => {
      return () => {
        onBlurFragment();
      };
    }, []);

    const renderItem: GroupChannelThreadProps['MessageList']['renderMessage'] = useFreshCallback((props) => {
      const content = renderMessage ? (
        renderMessage(props)
      ) : (
        <GroupChannelMessageRenderer hideParentMessage {...props} />
      );
      return <Box>{content}</Box>;
    });

    const memoizedFlatListProps = useMemo(
      () => ({
        ListHeaderComponent: (
          <GroupChannelThreadModule.ParentMessageInfo
            channel={channel}
            currentUserId={currentUser?.userId}
            onDeleteMessage={deleteMessage}
            onPressMediaMessage={_onPressMediaMessage}
          />
        ),
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

    const onPending = (message: SendbirdFileMessage | SendbirdUserMessage) => {
      groupChannelThreadPubSub.publish({ type: 'MESSAGE_SENT_PENDING', data: { message } });
    };

    const onSent = (message: SendbirdFileMessage | SendbirdUserMessage) => {
      groupChannelThreadPubSub.publish({ type: 'MESSAGE_SENT_SUCCESS', data: { message } });
    };

    const updateIfParentMessage = (message: SendbirdFileMessage | SendbirdUserMessage) => {
      if (message.messageId === parentMessage.parentMessageId) {
        setParentMessage(message);
      }
    };

    const onPressSendUserMessage: GroupChannelThreadProps['Input']['onPressSendUserMessage'] = useFreshCallback(
      async (params) => {
        const processedParams = await onBeforeSendUserMessage(params);
        const message = await sendUserMessage(processedParams, onPending);
        onSent(message);
      },
    );
    const onPressSendFileMessage: GroupChannelThreadProps['Input']['onPressSendFileMessage'] = useFreshCallback(
      async (params) => {
        const processedParams = await onBeforeSendFileMessage(params);
        const fileSize = (processedParams.file as File)?.size ?? processedParams.fileSize;
        const uploadSizeLimit = sbOptions.appInfo.uploadSizeLimit;

        if (fileSize && uploadSizeLimit && fileSize > uploadSizeLimit) {
          const sizeLimitString = `${getReadableFileSize(uploadSizeLimit)} MB`;
          toast.show(STRINGS.TOAST.FILE_UPLOAD_SIZE_LIMIT_EXCEEDED_ERROR(sizeLimitString), 'error');
          return;
        } else {
          const message = await sendFileMessage(processedParams, onPending);
          onSent(message);
        }
      },
    );
    const onPressUpdateUserMessage: GroupChannelThreadProps['Input']['onPressUpdateUserMessage'] = useFreshCallback(
      async (message, params) => {
        const processedParams = await onBeforeUpdateUserMessage(params);
        const updatedMessage = await updateUserMessage(message.messageId, processedParams);
        updateIfParentMessage(updatedMessage);
      },
    );
    const onPressUpdateFileMessage: GroupChannelThreadProps['Input']['onPressUpdateFileMessage'] = useFreshCallback(
      async (message, params) => {
        const processedParams = await onBeforeUpdateFileMessage(params);
        const updatedMessage = await updateFileMessage(message.messageId, processedParams);
        updateIfParentMessage(updatedMessage);
      },
    );
    const onScrolledAwayFromBottom = useFreshCallback((value: boolean) => {
      if (!value) resetNewMessages();
      setScrolledAwayFromBottom(value);
    });

    return (
      <GroupChannelThreadModule.Provider
        channel={channel}
        parentMessage={_parentMessage}
        groupChannelThreadPubSub={groupChannelThreadPubSub}
        keyboardAvoidOffset={keyboardAvoidOffset}
        threadedMessages={messages}
      >
        <GroupChannelThreadModule.Header onPressLeft={_onPressHeaderLeft} onPressSubtitle={_onPressHeaderSubtitle} />
        <StatusComposition loading={loading} LoadingComponent={<GroupChannelThreadModule.StatusLoading />}>
          <GroupChannelThreadModule.MessageList
            channel={channel}
            onResetMessageList={onResetMessageList}
            onResetMessageListWithStartingPoint={onResetMessageListWithStartingPoint}
            enableMessageGrouping={enableMessageGrouping}
            currentUserId={currentUser?.userId}
            renderMessage={renderItem}
            messages={messages}
            newMessages={newMessages}
            onTopReached={loadPrevious}
            onBottomReached={loadNext}
            hasNext={hasNext}
            scrolledAwayFromBottom={scrolledAwayFromBottom}
            onScrolledAwayFromBottom={onScrolledAwayFromBottom}
            onResendFailedMessage={resendMessage}
            onDeleteMessage={deleteMessage}
            onPressMediaMessage={_onPressMediaMessage}
            flatListProps={memoizedFlatListProps}
            startingPoint={startingPoint}
          />
          <GroupChannelThreadModule.Input
            SuggestedMentionList={GroupChannelThreadModule.SuggestedMentionList}
            shouldRenderInput={shouldRenderInput(channel)}
            onPressSendUserMessage={onPressSendUserMessage}
            onPressSendFileMessage={onPressSendFileMessage}
            onPressUpdateUserMessage={onPressUpdateUserMessage}
            onPressUpdateFileMessage={onPressUpdateFileMessage}
          />
        </StatusComposition>
      </GroupChannelThreadModule.Provider>
    );
  };
};

function shouldRenderInput(channel: SendbirdGroupChannel) {
  if (channel.isBroadcast) {
    return channel.myRole === 'operator';
  }

  return true;
}

export function threadMessageComparator(a: SendbirdMessage, b: SendbirdMessage) {
  return messageComparator(a, b) * -1;
}

export default createGroupChannelThreadFragment;
