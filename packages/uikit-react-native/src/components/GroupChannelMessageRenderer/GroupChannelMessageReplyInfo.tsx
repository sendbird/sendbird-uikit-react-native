import React from 'react';

import { User } from '@sendbird/chat';
import {
  Avatar,
  Box,
  Icon,
  PressBox,
  Text,
  createStyleSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { SendbirdFileMessage, SendbirdGroupChannel, SendbirdMessage, SendbirdUserMessage } from '@sendbird/uikit-utils';

import { useLocalization } from '../../hooks/useContext';

const AVATAR_LIMIT = 5;

type Props = {
  channel: SendbirdGroupChannel;
  message: SendbirdMessage;
  onPress?: (message: SendbirdUserMessage | SendbirdFileMessage) => void;
};

const createRepliedUserAvatars = (mostRepliedUsers: User[]) => {
  if (!mostRepliedUsers || mostRepliedUsers.length === 0) return null;

  const { palette } = useUIKitTheme();

  return mostRepliedUsers.slice(0, AVATAR_LIMIT).map((user, index) => {
    if (index < AVATAR_LIMIT - 1) {
      return (
        <Box style={styles.avatarContainer} key={index}>
          <Avatar size={20} uri={user?.profileUrl}></Avatar>
        </Box>
      );
    } else {
      return (
        <Box style={styles.avatarContainer} key={index}>
          <Avatar size={20} uri={user?.profileUrl}></Avatar>
          <Box style={styles.avatarOverlay} backgroundColor={palette.overlay01}>
            <Icon icon={'plus'} size={14} style={styles.plusIcon} color={'white'} />
          </Box>
        </Box>
      );
    }
  });
};

const GroupChannelMessageReplyInfo = ({ channel, message, onPress }: Props) => {
  const { STRINGS } = useLocalization();
  const { select, palette } = useUIKitTheme();

  if (!channel || !message.threadInfo || !message.threadInfo.replyCount) return null;

  const replyCountText = STRINGS.GROUP_CHANNEL_THREAD.REPLY_COUNT(message.threadInfo.replyCount || 0, 99);
  const onPressReply = () => {
    onPress?.(message as SendbirdUserMessage | SendbirdFileMessage);
  };

  return (
    <PressBox onPress={onPressReply} style={styles.replyContainer}>
      {createRepliedUserAvatars(message.threadInfo.mostRepliedUsers)}
      <Text caption3 color={select({ light: palette.primary300, dark: palette.primary200 })}>
        {replyCountText}
      </Text>
    </PressBox>
  );
};

const styles = createStyleSheet({
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 4,
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
  },
  plusIcon: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: 0,
    bottom: 0,
  },
});

export default React.memo(GroupChannelMessageReplyInfo);
