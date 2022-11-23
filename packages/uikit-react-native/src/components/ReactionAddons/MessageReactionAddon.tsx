import React from 'react';
import { Pressable } from 'react-native';

import type { Emoji } from '@sendbird/chat';
import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdBaseMessage } from '@sendbird/uikit-utils';

import { UNKNOWN_USER_ID } from '../../constants';
import { useSendbirdChat } from '../../hooks/useContext';
import ReactionRoundedButton from './ReactionRoundedButton';

const NUM_COL = 4;
const REACTION_MORE_KEY = 'reaction-more-button';
const createReactionButtons = (
  message: SendbirdBaseMessage,
  getEmoji: (key: string) => Emoji,
  currentUserId?: string,
) => {
  return (message.reactions ?? [])
    .map((reaction, index) => (
      <ReactionRoundedButton
        key={reaction.key}
        url={getEmoji(reaction.key).url}
        count={reaction.userIds.length}
        reacted={reaction.userIds.indexOf(currentUserId ?? UNKNOWN_USER_ID) > -1}
        style={[index % NUM_COL !== 3 && styles.marginRight, index < NUM_COL && styles.marginBottom]}
      />
    ))
    .concat(<ReactionRoundedButton.More key={REACTION_MORE_KEY} />);
};

const MessageReactionAddon = ({ message }: { message: SendbirdBaseMessage }) => {
  const { colors } = useUIKitTheme();
  const { emojiManager, currentUser } = useSendbirdChat();

  if (!message.reactions?.length) return null;

  const reactionButtons = createReactionButtons(message, (key) => emojiManager.allEmojiMap[key], currentUser?.userId);

  return (
    <Pressable
      style={[
        styles.reactionContainer,
        { backgroundColor: colors.background, borderColor: colors.ui.reaction.rounded.enabled.background },
      ]}
    >
      {reactionButtons}
    </Pressable>
  );
};

const styles = createStyleSheet({
  reactionContainer: {
    alignItems: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  marginRight: {
    marginRight: 4.5,
  },
  marginBottom: {
    marginBottom: 4,
  },
});

export default MessageReactionAddon;
