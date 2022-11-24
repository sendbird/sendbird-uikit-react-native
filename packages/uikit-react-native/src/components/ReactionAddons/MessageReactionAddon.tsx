import React from 'react';
import { Pressable } from 'react-native';

import type { Emoji } from '@sendbird/chat';
import type { Reaction } from '@sendbird/chat/message';
import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdBaseChannel, SendbirdBaseMessage } from '@sendbird/uikit-utils';

import { UNKNOWN_USER_ID } from '../../constants';
import { useSendbirdChat } from '../../hooks/useContext';
import ReactionRoundedButton from './ReactionRoundedButton';

const NUM_COL = 4;
const REACTION_MORE_KEY = 'reaction-more-button';
const createReactionButtons = (
  channel: SendbirdBaseChannel,
  message: SendbirdBaseMessage,
  getEmoji: (key: string) => Emoji,
  emojiLimit: number,
  currentUserId?: string,
) => {
  const isReacted = (reaction: Reaction) => {
    return reaction.userIds.indexOf(currentUserId ?? UNKNOWN_USER_ID) > -1;
  };

  const createOnPressReaction = (reaction: Reaction) => {
    return () => {
      if (isReacted(reaction)) {
        return channel.deleteReaction(message, reaction.key);
      } else {
        return channel.addReaction(message, reaction.key);
      }
    };
  };

  const reactions = message.reactions ?? [];
  const buttons = reactions.map((reaction, index) => (
    <Pressable key={reaction.key} onPress={createOnPressReaction(reaction)}>
      {({ pressed }) => {
        return (
          <ReactionRoundedButton
            url={getEmoji(reaction.key).url}
            count={reaction.userIds.length}
            reacted={pressed || isReacted(reaction)}
            style={[
              index % NUM_COL !== 3 && styles.marginRight,
              index < NUM_COL && reactions.length >= NUM_COL && styles.marginBottom,
            ]}
          />
        );
      }}
    </Pressable>
  ));

  if (buttons.length < emojiLimit) {
    buttons.push(<ReactionRoundedButton.More key={REACTION_MORE_KEY} />);
  }

  return buttons;
};

const MessageReactionAddon = ({ channel, message }: { channel: SendbirdBaseChannel; message: SendbirdBaseMessage }) => {
  const { colors } = useUIKitTheme();
  const { emojiManager, currentUser } = useSendbirdChat();

  if (!message.reactions?.length) return null;

  const reactionButtons = createReactionButtons(
    channel,
    message,
    (key) => emojiManager.allEmojiMap[key],
    emojiManager.allEmoji.length,
    currentUser?.userId,
  );

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
