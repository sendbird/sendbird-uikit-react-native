import React from 'react';

import type { SendbirdMessage } from '@sendbird/uikit-utils';
import { getMessageTimeFormat, useSafeAreaPadding } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import Icon from '../../components/Icon';
import PressBox from '../../components/PressBox';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Avatar from '../Avatar';
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
  const { paddingLeft, paddingRight } = useSafeAreaPadding(['left', 'right']);
  const color = colors.ui.openChannelMessage.default;

  return (
    <Box
      flexDirection={'row'}
      paddingVertical={grouped ? 5 : 6}
      paddingLeft={12 + paddingLeft}
      paddingRight={12 + paddingRight}
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
            <Box marginRight={4}>
              <Text
                caption1
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
        {'sender' in props.message && (
          <Box flexDirection={'row'}>
            {props.message.sendingStatus === 'failed' && (
              <Box marginTop={2}>
                <Icon icon={'error'} color={colors.error} size={16} />
              </Box>
            )}
          </Box>
        )}
      </Box>
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
