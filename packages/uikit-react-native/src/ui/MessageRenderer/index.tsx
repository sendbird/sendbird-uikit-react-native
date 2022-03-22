import React from 'react';
import { Pressable, View } from 'react-native';

import { useLocalization } from '@sendbird/uikit-react-native-core';
import { Avatar, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';
import { calcMessageGrouping, isMyMessage } from '@sendbird/uikit-utils';

import AdminMessage from './AdminMessage';
import FileMessage from './FileMessage';
import MessageContainer from './MessageContainer';
import MessageDateSeparator from './MessageDateSeparator';
import UnknownMessage from './UnknownMessage';
import UserMessage from './UserMessage';

type MessageStyleVariant = 'outgoing' | 'incoming';
export interface MessageRendererInterface<T = SendbirdMessage> {
  message: T;
  prevMessage?: SendbirdMessage;
  nextMessage?: SendbirdMessage;
  variant: MessageStyleVariant;
  groupWithPrev: boolean;
  groupWithNext: boolean;
  pressed: boolean;
}

type Props = {
  nextMessage?: SendbirdMessage;
  message: SendbirdMessage;
  prevMessage?: SendbirdMessage;
  enableMessageGrouping?: boolean;
};

const MessageRenderer: React.FC<Props> = ({ message, ...rest }) => {
  const variant: MessageStyleVariant = isMyMessage(message) ? 'outgoing' : 'incoming';
  const { groupWithPrev, groupWithNext } = calcMessageGrouping(
    Boolean(rest.enableMessageGrouping),
    message,
    rest.prevMessage,
    rest.nextMessage,
  );

  const messageComponent = () => {
    const props = { ...rest, variant, groupWithNext, groupWithPrev };
    if (message.isUserMessage()) {
      return (
        <Pressable style={styles.msgContainer}>
          {({ pressed }) => <UserMessage message={message} pressed={pressed} {...props} />}
        </Pressable>
      );
    }

    if (message.isFileMessage()) {
      return (
        <Pressable style={styles.msgContainer}>
          {({ pressed }) => <FileMessage message={message} pressed={pressed} {...props} />}
        </Pressable>
      );
    }

    if (message.isAdminMessage()) {
      return <AdminMessage message={message} pressed={false} {...props} />;
    }

    return (
      <Pressable style={styles.msgContainer}>
        {({ pressed }) => <UnknownMessage message={message} pressed={pressed} {...props} />}
      </Pressable>
    );
  };

  const chatAlignment = {
    incoming: styles.chatIncoming,
    outgoing: styles.chatOutgoing,
  };

  return (
    <MessageContainer>
      <MessageDateSeparator message={message} prevMessage={rest.prevMessage} />
      {message.isAdminMessage() ? (
        messageComponent()
      ) : (
        <View style={[chatAlignment[variant], groupWithNext ? styles.chatGroup : styles.chatNonGroup]}>
          {variant === 'incoming' && <IncomingAvatar message={message} grouping={groupWithNext} />}
          <View>
            {variant === 'incoming' && <IncomingSenderName message={message} grouping={groupWithPrev} />}
            {messageComponent()}
          </View>
          {variant === 'incoming' && <IncomingTime message={message} grouping={groupWithNext} />}
        </View>
      )}
    </MessageContainer>
  );
};
// TODO: Outgoing types, extract to components
const IncomingSenderName: React.FC<{ message: SendbirdMessage; grouping: boolean }> = ({ message, grouping }) => {
  const { colors } = useUIKitTheme();

  if (grouping) return null;
  return (
    <View style={styles.sender}>
      {(message.isFileMessage() || message.isUserMessage()) && (
        <Text caption1 color={colors.ui.message.incoming.enabled.textSenderName}>
          {message.sender?.nickname}
        </Text>
      )}
    </View>
  );
};
const IncomingAvatar: React.FC<{ message: SendbirdMessage; grouping: boolean }> = ({ message, grouping }) => {
  if (grouping) return <View style={styles.avatar} />;
  return (
    <View style={styles.avatar}>
      {(message.isFileMessage() || message.isUserMessage()) && <Avatar size={26} uri={message.sender?.profileUrl} />}
    </View>
  );
};
const IncomingTime: React.FC<{ message: SendbirdMessage; grouping: boolean }> = ({ message, grouping }) => {
  const { LABEL } = useLocalization();
  const { colors } = useUIKitTheme();

  if (grouping) return null;
  return (
    <View style={styles.timeIncoming}>
      <Text caption4 color={colors.ui.message.incoming.enabled.textTime}>
        {LABEL.GROUP_CHANNEL.FRAGMENT.LIST_MESSAGE_TIME(message)}
      </Text>
    </View>
  );
};

const styles = createStyleSheet({
  chatIncoming: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  chatOutgoing: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  msgContainer: {
    maxWidth: 240,
  },
  chatGroup: {
    marginBottom: 2,
  },
  chatNonGroup: {
    marginBottom: 16,
  },

  sender: {
    marginLeft: 12,
    marginBottom: 4,
  },
  avatar: {
    width: 26,
    marginRight: 12,
  },
  timeIncoming: {
    marginLeft: 4,
  },
});

export default React.memo(MessageRenderer);
