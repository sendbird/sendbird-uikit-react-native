import React from 'react';
import { Pressable } from 'react-native';

import type { Emoji } from '@sendbird/chat';
import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { useForceUpdate, useGroupChannelHandler } from '@sendbird/uikit-tools';
import type { SendbirdBaseChannel, SendbirdBaseMessage, SendbirdReaction } from '@sendbird/uikit-utils';
import { getReactionCount } from '@sendbird/uikit-utils';

import { DEFAULT_LONG_PRESS_DELAY, UNKNOWN_USER_ID } from '../../constants';
import { useReaction, useSendbirdChat } from '../../hooks/useContext';
import ReactionRoundedButton from './ReactionRoundedButton';

const NUM_COL = 4;
const REACTION_MORE_KEY = 'reaction-more-button';
export type ReactionAddonType = 'default' | 'thread_parent_message';

const getUserReacted = (reaction: SendbirdReaction, userId = UNKNOWN_USER_ID) => {
  return reaction.userIds.indexOf(userId) > -1;
};

const createOnPressReaction = (
  reaction: SendbirdReaction,
  channel: SendbirdBaseChannel,
  message: SendbirdBaseMessage,
  reacted: boolean,
) => {
  return () => {
    if (reacted) {
      return channel.deleteReaction(message, reaction.key);
    } else {
      return channel.addReaction(message, reaction.key);
    }
  };
};

const createReactionButtons = (
  channel: SendbirdBaseChannel,
  message: SendbirdBaseMessage,
  getEmoji: (key: string) => Emoji,
  emojiLimit: number,
  onOpenReactionList: () => void,
  onOpenReactionUserList: (focusIndex: number) => void,
  currentUserId?: string,
  reactionAddonType?: ReactionAddonType,
) => {
  const reactions = message.reactions ?? [];
  const buttons = reactions.map((reaction, index) => {
    const isNotLastOfRow = index % NUM_COL !== NUM_COL - 1;
    const isNotLastOfCol = index < NUM_COL && reactions.length >= NUM_COL;
    return (
      <Pressable
        key={reaction.key}
        onPress={createOnPressReaction(reaction, channel, message, getUserReacted(reaction, currentUserId))}
        onLongPress={() => onOpenReactionUserList(index)}
        delayLongPress={DEFAULT_LONG_PRESS_DELAY}
      >
        {({ pressed }) => (
          <ReactionRoundedButton
            url={getEmoji(reaction.key).url}
            count={getReactionCount(reaction)}
            reacted={pressed || getUserReacted(reaction, currentUserId)}
            style={
              reactionAddonType === 'default'
                ? [isNotLastOfRow && styles.marginRight, isNotLastOfCol && styles.marginBottom]
                : [styles.marginRight, styles.marginBottom]
            }
          />
        )}
      </Pressable>
    );
  });
  if (buttons.length < emojiLimit) {
    buttons.push(
      <Pressable key={REACTION_MORE_KEY} onPress={onOpenReactionList}>
        {({ pressed }) => <ReactionRoundedButton.More pressed={pressed} />}
      </Pressable>,
    );
  }

  return buttons;
};

const MessageReactionAddon = ({
  channel,
  message,
  reactionAddonType = 'default',
}: {
  channel: SendbirdBaseChannel;
  message: SendbirdBaseMessage;
  reactionAddonType?: ReactionAddonType;
}) => {
  const { colors } = useUIKitTheme();
  const { sdk, emojiManager, currentUser } = useSendbirdChat();
  const { openReactionList, openReactionUserList } = useReaction();
  const forceUpdate = useForceUpdate();

  useGroupChannelHandler(sdk, {
    async onReactionUpdated(_, event) {
      if (event.messageId === message.messageId) {
        message.applyReactionEvent(event);
        forceUpdate();
      }
    },
  });

  if (reactionAddonType === 'default' && !message.reactions?.length) return null;

  const reactionButtons = createReactionButtons(
    channel,
    message,
    (key) => emojiManager.allEmojiMap[key],
    emojiManager.allEmoji.length,
    () => openReactionList({ channel, message }),
    (focusIndex) => openReactionUserList({ channel, message, focusIndex }),
    currentUser?.userId,
    reactionAddonType,
  );

  const containerStyle =
    reactionAddonType === 'default' ? styles.reactionContainer : styles.reactionThreadParentMessageContainer;

  return (
    <Pressable
      style={[
        containerStyle,
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
  reactionThreadParentMessageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  marginRight: {
    marginRight: 4.5,
  },
  marginBottom: {
    marginBottom: 4,
  },
});

export default MessageReactionAddon;
