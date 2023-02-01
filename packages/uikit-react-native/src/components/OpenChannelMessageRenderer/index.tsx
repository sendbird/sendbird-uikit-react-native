import React from 'react';
import { Pressable, PressableProps, View } from 'react-native';

import { Text, createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import { calcMessageGrouping, conditionChaining, useIIFE } from '@sendbird/uikit-utils';

import { DEFAULT_LONG_PRESS_DELAY } from '../../constants';
import type { OpenChannelProps } from '../../domain/openChannel/types';
import MessageContainer from '../MessageRenderer/MessageContainer';
import MessageDateSeparator from '../MessageRenderer/MessageDateSeparator';
import MessageIncomingAvatar from '../MessageRenderer/MessageIncomingAvatar';
import MessageIncomingSenderName from '../MessageRenderer/MessageIncomingSenderName';
import MessageTime from '../MessageRenderer/MessageTime';

const OpenChannelMessageRenderer: OpenChannelProps['Fragment']['renderMessage'] = ({
  message,
  onPress,
  onLongPress,
  ...rest
}) => {
  const { groupWithPrev, groupWithNext } = calcMessageGrouping(
    Boolean(rest.enableMessageGrouping),
    message,
    rest.prevMessage,
    rest.nextMessage,
  );

  const messageComponent = useIIFE(() => {
    const pressableProps: PressableProps = {
      style: styles.msgContainer,
      disabled: !onPress && !onLongPress,
      onPress,
      onLongPress,
      delayLongPress: DEFAULT_LONG_PRESS_DELAY,
    };

    // const messageProps = { ...rest, groupWithNext, groupWithPrev };

    if (message.isUserMessage()) {
      return <Pressable {...pressableProps}>{() => <Text>{'User message_' + message.message}</Text>}</Pressable>;
    }

    if (message.isFileMessage()) {
      return <Pressable {...pressableProps}>{() => <Text>{'File message'}</Text>}</Pressable>;
    }

    if (message.isAdminMessage()) {
      return <Text>{'Admin message'}</Text>;
    }

    return <Pressable {...pressableProps}>{() => <Text>{'Unknown message'}</Text>}</Pressable>;
  });

  return (
    <MessageContainer>
      <MessageDateSeparator message={message} prevMessage={rest.prevMessage} />
      <View
        style={[
          conditionChaining(
            [groupWithNext, Boolean(rest.nextMessage)],
            [styles.chatGroup, styles.chatNonGroup, styles.chatLastMessage],
          ),
        ]}
      >
        <MessageIncomingAvatar message={message} grouping={groupWithPrev} />
        <View style={styles.bubbleContainer}>
          <MessageIncomingSenderName message={message} grouping={groupWithPrev} />
          <View style={styles.bubbleWrapper}>
            {messageComponent}
            <MessageTime message={message} grouping={groupWithPrev} style={styles.timeIncoming} />
          </View>
        </View>
      </View>
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
  chatLastMessage: {
    marginBottom: 16,
  },
  msgContainer: {
    maxWidth: 240,
  },
  bubbleContainer: {
    flexShrink: 1,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  outgoingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default React.memo(OpenChannelMessageRenderer);
