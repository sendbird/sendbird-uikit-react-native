import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

import type { BaseMessage } from '@sendbird/chat/message';
import { Icon, Image, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { useGroupChannelHandler } from '@sendbird/uikit-tools';
import { Logger, useSafeAreaPadding } from '@sendbird/uikit-utils';
import type { SendbirdBaseChannel, SendbirdBaseMessage } from '@sendbird/uikit-utils';

import { UNKNOWN_USER_ID } from '../../constants';
import { useReaction, useSendbirdChat } from '../../hooks/useContext';

type Props = {
  onClose: () => Promise<void>;
  channel: SendbirdBaseChannel;
  message: SendbirdBaseMessage;
};

const EmojiReactionPressable = ({
  url,
  reacted,
  selectedBackground,
  enabledBackground,
  onPress,
}: {
  url: string;
  reacted: boolean;
  selectedBackground: string;
  enabledBackground: string;
  onPress: () => void;
}) => {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.button, { backgroundColor: reacted || pressed ? selectedBackground : enabledBackground }]}
    >
      <Image source={{ uri: url }} style={styles.emoji} />
    </Pressable>
  );
};

const EmojiMorePressable = ({
  selectedBackground,
  enabledBackground,
  iconColor,
  onPress,
}: {
  selectedBackground: string;
  enabledBackground: string;
  iconColor: string;
  onPress: () => void;
}) => {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.button, { backgroundColor: pressed ? selectedBackground : enabledBackground }]}
    >
      <Icon icon={'emoji-more'} style={styles.emoji} color={iconColor} />
    </Pressable>
  );
};

const BottomSheetReactionAddon = ({ onClose, message, channel }: Props) => {
  const { emojiManager, currentUser, sdk } = useSendbirdChat();
  const { updateReactionFocusedItem, openReactionList } = useReaction();
  const { colors } = useUIKitTheme();
  const safeArea = useSafeAreaPadding(['left', 'right']);

  useGroupChannelHandler(sdk, {
    async onReactionUpdated(eventChannel, event) {
      if (channel?.url === eventChannel.url && event.messageId === message?.messageId) {
        const msg = (await sdk.message.getMessage({
          includeReactions: true,
          messageId: message.messageId,
          channelUrl: message.channelUrl,
          channelType: message.channelType,
        })) as null | BaseMessage;
        if (msg) updateReactionFocusedItem({ message: msg });
      }
    },
  });

  const emojiAll = emojiManager.allEmoji.slice(0, 5);
  const color = colors.ui.reaction.default;

  return (
    <View style={[styles.container, { marginStart: safeArea.paddingStart, marginEnd: safeArea.paddingEnd }]}>
      {emojiAll.map(({ key, url }) => {
        const reactionUserIds = message?.reactions?.find((it) => it.key === key)?.userIds ?? [];
        const currentUserIdx = reactionUserIds.indexOf(currentUser?.userId ?? UNKNOWN_USER_ID);
        const reacted = currentUserIdx > -1;

        const onPress = async () => {
          const action = (message: BaseMessage, key: string) => {
            return reacted ? channel.deleteReaction(message, key) : channel.addReaction(message, key);
          };

          await action(message, key)
            .catch((error) => {
              Logger.warn('Failed to reaction', error);
            })
            .finally(() => {
              onClose();
            });
        };

        return (
          <EmojiReactionPressable
            key={key}
            url={url}
            reacted={reacted}
            selectedBackground={color.selected.background}
            enabledBackground={color.enabled.background}
            onPress={onPress}
          />
        );
      })}

      <EmojiMorePressable
        selectedBackground={color.selected.background}
        enabledBackground={color.enabled.background}
        iconColor={colors.onBackground03}
        onPress={async () => {
          await onClose();
          openReactionList({ channel, message });
        }}
      />
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
