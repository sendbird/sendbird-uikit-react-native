import React from 'react';

import { SendingStatus } from '@sendbird/chat/message';
import type { SendbirdMessage } from '@sendbird/uikit-utils';
import { getMessageTimeFormat } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import Icon from '../../components/Icon';
import PressBox from '../../components/PressBox';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Avatar from '../Avatar';
import LoadingSpinner from '../LoadingSpinner';
import type { OpenChannelMessageProps } from './index';

type Props = {
  pressed?: boolean;
};

const MessageContainer = ({
  children,
  channel,
  grouped,
  pressed,
  ...props
}: OpenChannelMessageProps<SendbirdMessage, Props>) => {
  const { colors } = useUIKitTheme();
  const color = colors.ui.openChannelMessage.default;

  const renderSendingStatus = () => {
    if (!('sendingStatus' in props.message)) return null;

    switch (props.message.sendingStatus) {
      case SendingStatus.PENDING: {
        return (
          <SendingStatusContainer>
            <LoadingSpinner color={colors.primary} size={16} />
          </SendingStatusContainer>
        );
      }
      case SendingStatus.FAILED: {
        return (
          <SendingStatusContainer>
            <Icon icon={'error'} color={colors.error} size={16} />
          </SendingStatusContainer>
        );
      }
      default: {
        return null;
      }
    }
  };

  return (
    <Box
      flexDirection={'row'}
      paddingVertical={grouped ? 5 : 6}
      paddingLeft={12}
      paddingRight={12}
      backgroundColor={pressed ? color.pressed.background : color.enabled.background}
    >
      <Box marginRight={12}>
        {!grouped && 'sender' in props.message ? (
          <PressBox onPress={props.onPressAvatar}>
            <Avatar size={styles.avatar.width} uri={props.message.sender.profileUrl} />
          </PressBox>
        ) : (
          <Box style={styles.avatar} />
        )}
      </Box>
      <Box flexShrink={1} flex={1} flexDirection={'column'} alignItems={'flex-start'}>
        {!grouped && 'sender' in props.message && (
          <Box flexDirection={'row'} alignItems={'center'} marginBottom={2}>
            <Box marginRight={4} flexShrink={1}>
              <Text
                caption1
                ellipsizeMode={'middle'}
                numberOfLines={1}
                color={
                  channel.isOperator(props.message.sender.userId)
                    ? color.enabled.textOperator
                    : color.enabled.textSenderName
                }
              >
                {props.strings?.senderName ?? props.message.sender.nickname}
              </Text>
            </Box>
            <Box>
              <Text caption4 color={color.enabled.textTime}>
                {props.strings?.sentDate ?? getMessageTimeFormat(new Date(props.message.createdAt))}
              </Text>
            </Box>
          </Box>
        )}
        <Box style={styles.message}>{children}</Box>

        {renderSendingStatus()}
      </Box>
    </Box>
  );
};

const SendingStatusContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box flexDirection={'row'}>
      <Box marginTop={2}>{children}</Box>
    </Box>
  );
};

const styles = createStyleSheet({
  avatar: {
    width: 28,
  },
  message: {
    width: '100%',
  },
});

export default MessageContainer;
