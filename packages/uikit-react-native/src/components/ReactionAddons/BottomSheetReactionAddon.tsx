import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import { Icon, Image, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { SendbirdBaseChannel, SendbirdBaseMessage, useUniqId } from '@sendbird/uikit-utils';

import { UNKNOWN_USER_ID } from '../../constants';
import { useReaction, useSendbirdChat } from '../../hooks/useContext';

type Props = {
  onClose: () => Promise<void>;
  channel: SendbirdBaseChannel;
  message: SendbirdBaseMessage;
};
const COMPONENT_NAME = 'BottomSheetReactionAddon';
const BottomSheetReactionAddon = ({ onClose, message, channel }: Props) => {
  const { emojiManager, currentUser, sdk } = useSendbirdChat();
  const { updateReactionFocusedItem, openReactionList } = useReaction();
  const { colors } = useUIKitTheme();
  const id = useUniqId(COMPONENT_NAME);
  const { left, right } = useSafeAreaInsets();

  useChannelHandler(sdk, COMPONENT_NAME + id, {
    async onReactionUpdated(eventChannel, event) {
      if (channel?.url === eventChannel.url && event.messageId === message?.messageId) {
        updateReactionFocusedItem({
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

  const emojiAll = emojiManager.allEmoji.slice(0, 5);
  const color = colors.ui.reaction.default;

  return (
    <View style={[styles.container, { marginRight: right, marginLeft: left }]}>
      {emojiAll.map(({ key, url }) => {
        const reactionUserIds = message?.reactions?.find((it) => it.key === key)?.userIds ?? [];
        const currentUserIdx = reactionUserIds.indexOf(currentUser?.userId ?? UNKNOWN_USER_ID);
        const reacted = currentUserIdx > -1;

        const onPress = () => {
          if (reacted) channel.deleteReaction(message, key);
          else channel.addReaction(message, key);
          onClose();
        };

        return (
          <Pressable
            key={key}
            onPress={onPress}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: reacted || pressed ? color.selected.background : color.enabled.background },
            ]}
          >
            <Image source={{ uri: url }} style={styles.emoji} />
          </Pressable>
        );
      })}

      <Pressable
        onPress={async () => {
          await onClose();
          openReactionList({ channel, message });
        }}
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
