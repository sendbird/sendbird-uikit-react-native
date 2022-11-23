import React from 'react';
import { Pressable, View } from 'react-native';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import { Icon, Image, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { useUniqId } from '@sendbird/uikit-utils';

import { UNKNOWN_USER_ID } from '../../constants';
import { useReaction, useSendbirdChat } from '../../hooks/useContext';

const COMONENT_NAME = 'BottomSheetReactionAddon';
const BottomSheetReactionAddon = ({ onClose }: { onClose: () => void }) => {
  const { emojiManager, currentUser, sdk, features } = useSendbirdChat();
  const { channel, message, setFocusedMessage } = useReaction();
  const { colors } = useUIKitTheme();
  const id = useUniqId(COMONENT_NAME);

  useChannelHandler(sdk, COMONENT_NAME + id, {
    async onReactionUpdated(eventChannel, event) {
      if (channel?.url === eventChannel.url && event.messageId === message?.messageId) {
        setFocusedMessage({
          message: await sdk.message.getMessage({
            includeReactions: true,
            messageId: message.messageId,
            channelUrl: message.channelUrl,
            channelType: message.channelType,
          }),
        });
      }
    },
  });

  if (!features.reactionEnabled || !channel || !message) return null;

  const emojiAll = emojiManager.allEmoji.slice(0, 5);
  const color = colors.ui.reaction.default;

  return (
    <View style={styles.container}>
      {emojiAll.map(({ key, url }) => {
        const reactedUserIds = message?.reactions?.find((it) => it.key === key)?.userIds ?? [];

        const idx = reactedUserIds.indexOf(currentUser?.userId ?? UNKNOWN_USER_ID);
        const hasReaction = idx > -1;

        return (
          <Pressable
            key={key}
            onPress={() => {
              if (hasReaction) channel.deleteReaction(message, key);
              else channel.addReaction(message, key);
              onClose();
            }}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: hasReaction || pressed ? color.selected.background : color.enabled.background },
            ]}
          >
            <Image source={{ uri: url }} style={styles.emoji} />
          </Pressable>
        );
      })}

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? color.selected.background : color.enabled.background },
        ]}
      >
        <Icon icon={'emoji-more'} style={styles.emoji} color={colors.onBackground03} />
      </Pressable>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: 44,
    height: 44,
    padding: 4,
    borderRadius: 8,
  },
  emoji: {
    width: '100%',
    height: '100%',
  },
});

export default BottomSheetReactionAddon;
