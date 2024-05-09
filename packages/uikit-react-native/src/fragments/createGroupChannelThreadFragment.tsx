import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { MessageCollection, MessageFilter } from '@sendbird/chat/groupChannel';
import { ReplyType } from '@sendbird/chat/message';
import { Box } from '@sendbird/uikit-react-native-foundation';
import { useGroupChannelMessages } from '@sendbird/uikit-tools';
import type { SendbirdFileMessage, SendbirdGroupChannel, SendbirdUserMessage } from '@sendbird/uikit-utils';
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
import createGroupChannelThreadModule from '../domain/groupChannelThread/module/createGroupChannelThreadModule';
import type {
  GroupChannelThreadFragment,
  GroupChannelThreadModule,
  GroupChannelThreadProps,
  GroupChannelThreadPubSubContextPayload,
} from '../domain/groupChannelThread/types';
import { usePlatformService, useSendbirdChat } from '../hooks/useContext';
import pubsub from '../utils/pubsub';

const createGroupChannelThreadFragment = (initModule?: Partial<GroupChannelThreadModule>): GroupChannelThreadFragment => {
  const GroupChannelThreadModule = createGroupChannelThreadModule(initModule);
  
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
            sortComparator = messageComparator,
            flatListProps,
            messageListQueryParams,
          }) => {
    const { playerService, recorderService } = usePlatformService();
    const { sdk, currentUser, sbOptions } = useSendbirdChat();
    
    const [internalSearchItem, setInternalSearchItem] = useState(searchItem);
    const navigateFromMessageSearch = useCallback(() => Boolean(searchItem), []);
    
    const [groupChannelPubSub] = useState(() => pubsub<GroupChannelThreadPubSubContextPayload>());
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
    } = useGroupChannelMessages(sdk, channel, {
      shouldCountNewMessages: () => scrolledAwayFromBottomRef.current,
      onMessagesReceived(messages) {
        groupChannelPubSub.publish({ type: 'MESSAGES_RECEIVED', data: { messages } });
      },
      onMessagesUpdated(messages) {
        groupChannelPubSub.publish({ type: 'MESSAGES_UPDATED', data: { messages } });
      },
      onChannelDeleted,
      onCurrentUserBanned: onChannelDeleted,
      collectionCreator: getCollectionCreator(channel, messageListQueryParams),
      sortComparator,
      markAsRead: confirmAndMarkAsRead,
      replyType,
      startingPoint: internalSearchItem?.startingPoint,
    });
    
    const onBlurFragment = () => {
      return Promise.allSettled([playerService.reset(), recorderService.reset()]);
    };
    const _onPressHeaderLeft = useFreshCallback(async () => {
      await onBlurFragment();
      onPressHeaderLeft();
    });
    const _onPressHeaderRight = useFreshCallback(async () => {
      await onBlurFragment();
      onPressHeaderRight();
    });
    const _onPressMediaMessage: NonNullable<GroupChannelThreadProps['MessageList']['onPressMediaMessage']> = useFreshCallback(
      async (message, deleteMessage, uri) => {
        await onBlurFragment();
        onPressMediaMessage(message, deleteMessage, uri);
      },
    );
    
    useEffect(() => {
      return () => {
        onBlurFragment();
      };
    }, []);
    
    const renderItem: GroupChannelThreadProps['MessageList']['renderMessage'] = useFreshCallback((props) => {
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
        ListEmptyComponent: <GroupChannelThreadModule.StatusEmpty />,
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
    const onUpdateSearchItem: GroupChannelThreadProps['MessageList']['onUpdateSearchItem'] = useCallback((searchItem) => {
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
        const message = await sendFileMessage(processedParams, onPending);
        onSent(message);
      },
    );
    const onPressUpdateUserMessage: GroupChannelThreadProps['Input']['onPressUpdateUserMessage'] = useFreshCallback(
      async (message, params) => {
        const processedParams = await onBeforeUpdateUserMessage(params);
        await updateUserMessage(message.messageId, processedParams);
      },
    );
    const onPressUpdateFileMessage: GroupChannelThreadProps['Input']['onPressUpdateFileMessage'] = useFreshCallback(
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
      <GroupChannelThreadModule.Provider
        channel={channel}
        groupChannelThreadPubSub={groupChannelPubSub}
        enableTypingIndicator={enableTypingIndicator ?? sbOptions.uikit.groupChannel.channel.enableTypingIndicator}
        keyboardAvoidOffset={keyboardAvoidOffset}
        messages={messages}
        onUpdateSearchItem={onUpdateSearchItem}
      >
        <GroupChannelThreadModule.Header
          shouldHideRight={navigateFromMessageSearch}
          onPressHeaderLeft={_onPressHeaderLeft}
          onPressHeaderRight={_onPressHeaderRight}
        />
        <StatusComposition loading={loading} LoadingComponent={<GroupChannelThreadModule.StatusLoading />}>
          <GroupChannelThreadModule.MessageList
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
            scrolledAwayFromBottom={scrolledAwayFromBottom}
            onScrolledAwayFromBottom={onScrolledAwayFromBottom}
            renderNewMessagesButton={renderNewMessagesButton}
            renderScrollToBottomButton={renderScrollToBottomButton}
            onResendFailedMessage={resendMessage}
            onDeleteMessage={deleteMessage}
            onPressMediaMessage={_onPressMediaMessage}
            flatListProps={memoizedFlatListProps}
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

function getCollectionCreator(
  channel: SendbirdGroupChannel,
  messageListQueryParams?: GroupChannelThreadProps['Fragment']['messageListQueryParams'],
  deprecatedCreatorProp?: () => MessageCollection,
) {
  if (!messageListQueryParams && deprecatedCreatorProp) return deprecatedCreatorProp;
  
  return (defaultParams: GroupChannelThreadProps['Fragment']['messageListQueryParams']) => {
    const params = { ...defaultParams, ...messageListQueryParams };
    return channel.createMessageCollection({
      ...params,
      filter: new MessageFilter(params),
    });
  };
}

export default createGroupChannelThreadFragment;
