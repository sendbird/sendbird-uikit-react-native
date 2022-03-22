import React from 'react';
import { Pressable, View } from 'react-native';

import { createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';
import { calcMessageGrouping, isMyMessage } from '@sendbird/uikit-utils';

import AdminMessage from './AdminMessage';
import FileMessage from './FileMessage';
import MessageContainer from './MessageContainer';
import MessageDateSeparator from './MessageDateSeparator';
import MessageIncomingAvatar from './MessageIncomingAvatar';
import MessageIncomingSenderName from './MessageIncomingSenderName';
import MessageOutgoingStatus from './MessageOutgoingStatus';
import MessageTime from './MessageTime';
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
  currentUserId?: string;
  nextMessage?: SendbirdMessage;
  message: SendbirdMessage;
  prevMessage?: SendbirdMessage;
  enableMessageGrouping?: boolean;
};

const MessageRenderer: React.FC<Props> = ({ currentUserId, message, ...rest }) => {
  const variant: MessageStyleVariant = isMyMessage(message, currentUserId) ? 'outgoing' : 'incoming';
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

  return (
    <MessageContainer>
      <MessageDateSeparator message={message} prevMessage={rest.prevMessage} />
      {message.isAdminMessage() ? (
        messageComponent()
      ) : (
        <View
          style={[
            { incoming: styles.chatIncoming, outgoing: styles.chatOutgoing }[variant],
            groupWithNext ? styles.chatGroup : styles.chatNonGroup,
          ]}
        >
          {variant === 'outgoing' && (
            <View style={styles.outgoingContainer}>
              {(message.isFileMessage() || message.isUserMessage()) && <MessageOutgoingStatus message={message} />}
              <MessageTime message={message} grouping={groupWithNext} style={styles.timeOutgoing} />
            </View>
          )}
          {variant === 'incoming' && <MessageIncomingAvatar message={message} grouping={groupWithNext} />}
          <View>
            {variant === 'incoming' && <MessageIncomingSenderName message={message} grouping={groupWithPrev} />}
            {messageComponent()}
          </View>
          {variant === 'incoming' && (
            <MessageTime message={message} grouping={groupWithNext} style={styles.timeIncoming} />
          )}
        </View>
      )}
    </MessageContainer>
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
  timeIncoming: {
    marginLeft: 4,
  },
  timeOutgoing: {
    marginRight: 4,
  },
  chatGroup: {
    marginBottom: 2,
  },
  chatNonGroup: {
    marginBottom: 16,
  },
  msgContainer: {
    maxWidth: 240,
  },
  outgoingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(MessageRenderer);
