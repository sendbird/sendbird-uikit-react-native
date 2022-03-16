import React, { useCallback } from 'react';
import { Image, View } from 'react-native';

import { useGroupChannelMessages } from '@sendbird/chat-react-hooks';
import type { GroupChannelFragment, GroupChannelModule, GroupChannelProps } from '@sendbird/uikit-react-native-core';
import { createGroupChannelModule, useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Text } from '@sendbird/uikit-react-native-foundation';
import { EmptyFunction, messageComparator } from '@sendbird/uikit-utils';

const createGroupChannelFragment = (initModule?: GroupChannelModule): GroupChannelFragment => {
  const GroupChannelModule = createGroupChannelModule(initModule);

  return ({
    MessageRenderer,
    NewMessageTooltip = null,
    enableMessageGrouping = true,
    Header,
    onPressHeaderLeft = EmptyFunction,
    onPressHeaderRight = EmptyFunction,
    channel,
    queryCreator,
    collectionCreator,
    sortComparator = messageComparator,
    children,
  }) => {
    const { sdk, currentUser } = useSendbirdChat();

    const { messages, nextMessages, newMessagesFromNext, next, prev } = useGroupChannelMessages(
      sdk,
      channel,
      currentUser?.userId,
      {
        collectionCreator,
        queryCreator,
        sortComparator,
        enableCollectionWithoutLocalCache: true,
      },
    );

    const renderMessages: GroupChannelProps['MessageList']['renderMessage'] = useCallback(
      (message, prevMessage) => {
        if (MessageRenderer) {
          return (
            <MessageRenderer
              message={message}
              prevMessage={prevMessage}
              enableMessageGrouping={enableMessageGrouping}
            />
          );
        }

        if (message.isAdminMessage()) {
          return (
            <View>
              <Text>{message.message}</Text>
            </View>
          );
        }

        if (message.isUserMessage()) {
          return (
            <View>
              <Text>{message.message}</Text>
            </View>
          );
        }

        if (message.isFileMessage()) {
          return (
            <View>
              <Image style={{ width: 200, height: 200 }} source={{ uri: message.url }} />
            </View>
          );
        }

        return (
          <View>
            <Text>{'Unknown Message'}</Text>
          </View>
        );
      },
      [MessageRenderer, enableMessageGrouping],
    );

    return (
      <GroupChannelModule.Provider channel={channel}>
        <GroupChannelModule.Header
          Header={Header}
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={onPressHeaderRight}
        />
        <GroupChannelModule.MessageList
          messages={messages}
          renderMessage={renderMessages}
          NewMessageTooltip={NewMessageTooltip}
          newMessagesFromNext={newMessagesFromNext}
          nextMessages={nextMessages}
          onTopReached={prev}
          onBottomReached={next}
        />
        {children}
      </GroupChannelModule.Provider>
    );
  };
};

export default createGroupChannelFragment;
