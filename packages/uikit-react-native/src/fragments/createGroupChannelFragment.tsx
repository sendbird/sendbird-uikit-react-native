import React, { useMemo, useState } from 'react';

import { useGroupChannelMessages } from '@sendbird/uikit-chat-hooks';
import {
  NOOP,
  PASS,
  SendbirdGroupChannel,
  messageComparator,
  useFreshCallback,
  useRefTracker,
} from '@sendbird/uikit-utils';

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
    const [scrolledAwayFromBottom, setScrolledAwayFromBottom] = useState(false);
    const scrolledAwayFromBottomRef = useRefTracker(scrolledAwayFromBottom);

    const {
      loading,
      messages,
      newMessages,
      resetNewMessages,
      next,
      prev,
      sendFileMessage,
      sendUserMessage,
      updateFileMessage,
      updateUserMessage,
      resendMessage,
      deleteMessage,
    } = useGroupChannelMessages(sdk, channel, currentUser?.userId, {
      collectionCreator,
      queryCreator,
      sortComparator,
      onChannelDeleted,
      enableCollectionWithoutLocalCache: !queryCreator,
      shouldCountNewMessages: () => scrolledAwayFromBottomRef.current,
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
      [flatListProps],
    );

    const onPressSendUserMessage: GroupChannelProps['Input']['onPressSendUserMessage'] = useFreshCallback(
      async (params) => {
        const processedParams = await onBeforeSendUserMessage(params);
        await sendUserMessage(processedParams);
      },
    );
    const onPressSendFileMessage: GroupChannelProps['Input']['onPressSendFileMessage'] = useFreshCallback(
      async (params) => {
        const processedParams = await onBeforeSendFileMessage(params);
        await sendFileMessage(processedParams);
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
      await sendFileMessage(processedParams);
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
        await sendUserMessage(processedParams);
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
        enableTypingIndicator={enableTypingIndicator}
        keyboardAvoidOffset={keyboardAvoidOffset}
      >
        <GroupChannelModule.Header onPressHeaderLeft={onPressHeaderLeft} onPressHeaderRight={onPressHeaderRight} />
        <StatusComposition loading={loading} LoadingComponent={<GroupChannelModule.StatusLoading />}>
          <GroupChannelModule.MessageList
            channel={channel}
            enableMessageGrouping={enableMessageGrouping}
            currentUserId={currentUser?.userId}
            renderMessage={_renderMessage}
            messages={messages}
            newMessages={newMessages}
            onTopReached={prev}
            onBottomReached={next}
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

export default createGroupChannelFragment;
