import type { SendbirdMessage } from '@gathertown/uikit-utils';
import { getMessageTimeFormat, isSendableMessage } from '@gathertown/uikit-utils';
import React, { useContext } from 'react';
import { Pressable } from 'react-native';

import Box from '../../components/Box';
import Text from '../../components/Text';
import { CustomComponentContext } from '../../context/CustomComponentCtx';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Avatar from '../Avatar';
import type { GroupChannelMessageProps } from './index';

export type IncomingMessageContainerRenderProp = (props: {
  content: React.ReactNode;
  groupedWithNext: boolean;
  groupedWithPrev: boolean;
  playerId: string;
  displayedTime: string;
}) => React.ReactElement;

export type OutgoingMessageContainerRenderProp = (props: {
  content: React.ReactNode;
  groupedWithNext: boolean;
  groupedWithPrev: boolean;
  displayedTime: string;
}) => React.ReactElement;

type Props = GroupChannelMessageProps<SendbirdMessage>;

const MessageContainer = (props: Props) => {
  const ctx = useContext(CustomComponentContext);
  if (props.variant === 'incoming') {
    return <MessageContainer.Incoming {...props} renderMessageContainer={ctx?.renderIncomingMessageContainer} />;
  } else {
    return <MessageContainer.Outgoing {...props} renderMessageContainer={ctx?.renderOutgoingMessageContainer} />;
  }
};

MessageContainer.Incoming = function MessageContainerIncoming({
  children,
  groupedWithNext,
  groupedWithPrev,
  message,
  onPressAvatar,
  strings,
  parentMessage,
  renderMessageContainer,
}: Props & { renderMessageContainer?: IncomingMessageContainerRenderProp }) {
  const { colors } = useUIKitTheme();
  const color = colors.ui.groupChannelMessage.incoming;

  if (renderMessageContainer) {
    return renderMessageContainer?.({
      content: children,
      groupedWithNext,
      groupedWithPrev,
      playerId: isSendableMessage(message) ? message.sender.userId : '',
      displayedTime: strings?.sentDate ?? getMessageTimeFormat(new Date(message.createdAt)),
    });
  }

  return (
    <Box flexDirection={'row'} justifyContent={'flex-start'} alignItems={'flex-end'}>
      <Box width={26} marginRight={12}>
        {(message.isFileMessage() || message.isUserMessage()) && !groupedWithNext && (
          <Pressable onPress={onPressAvatar}>
            <Avatar size={26} uri={message.sender?.profileUrl} />
          </Pressable>
        )}
      </Box>
      <Box flexShrink={1}>
        {parentMessage}
        {!groupedWithPrev && !message.parentMessage && (
          <Box marginLeft={12} marginBottom={4}>
            {(message.isFileMessage() || message.isUserMessage()) && (
              <Text caption1 color={color.enabled.textSenderName} numberOfLines={1}>
                {strings?.senderName ?? message.sender.nickname}
              </Text>
            )}
          </Box>
        )}

        <Box flexDirection={'row'} alignItems={'flex-end'}>
          <Box style={styles.bubble}>{children}</Box>
          {!groupedWithNext && (
            <Box marginLeft={4}>
              <Text caption4 color={color.enabled.textTime}>
                {strings?.sentDate ?? getMessageTimeFormat(new Date(message.createdAt))}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

MessageContainer.Outgoing = function MessageContainerOutgoing({
  children,
  message,
  groupedWithNext,
  groupedWithPrev,
  strings,
  sendingStatus,
  parentMessage,
  renderMessageContainer,
}: Props & { renderMessageContainer?: OutgoingMessageContainerRenderProp }) {
  const { colors } = useUIKitTheme();
  const color = colors.ui.groupChannelMessage.outgoing;

  if (renderMessageContainer) {
    return renderMessageContainer({
      content: children,
      groupedWithNext,
      groupedWithPrev,
      displayedTime: strings?.sentDate ?? getMessageTimeFormat(new Date(message.createdAt)),
    });
  }

  return (
    <Box>
      {parentMessage}
      <Box flexDirection={'row'} justifyContent={'flex-end'} alignItems={'flex-end'}>
        <Box flexDirection={'row'} alignItems={'flex-end'} justifyContent={'center'}>
          {sendingStatus && <Box marginRight={4}>{sendingStatus}</Box>}
          {!groupedWithNext && (
            <Box marginRight={4}>
              <Text caption4 color={color.enabled.textTime}>
                {strings?.sentDate ?? getMessageTimeFormat(new Date(message.createdAt))}
              </Text>
            </Box>
          )}
        </Box>
        <Box style={styles.bubble}>{children}</Box>
      </Box>
    </Box>
  );
};

const styles = createStyleSheet({
  bubble: {
    maxWidth: 240,
    overflow: 'hidden',
    flexShrink: 1,
  },
});

export default MessageContainer;
