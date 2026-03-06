import React, { useState } from 'react';
import { FlatList, Pressable, View, useWindowDimensions } from 'react-native';

import type { BaseMessage } from '@sendbird/chat/message';
import { Image, Modal, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { Logger, useSafeAreaPadding } from '@sendbird/uikit-utils';
import type { SendbirdBaseChannel, SendbirdBaseMessage } from '@sendbird/uikit-utils';

import { UNKNOWN_USER_ID } from '../../constants';
import type { ReactionBottomSheetProps } from './index';

const ReactionEmojiPressable = ({
  emojiKey,
  url,
  message,
  channel,
  currentUserId,
  selectedBackground,
  enabledBackground,
  onClose,
}: {
  emojiKey: string;
  url: string;
  message: SendbirdBaseMessage | undefined;
  channel: SendbirdBaseChannel | undefined;
  currentUserId: string | undefined;
  selectedBackground: string;
  enabledBackground: string;
  onClose: () => Promise<void>;
}) => {
  const [pressed, setPressed] = useState(false);

  const reactedUserIds = message?.reactions?.find((it) => it.key === emojiKey)?.userIds ?? [];
  const idx = reactedUserIds.indexOf(currentUserId ?? UNKNOWN_USER_ID);
  const reacted = idx > -1;

  return (
    <Pressable
      onPress={async () => {
        if (message && channel) {
          const action = (msg: BaseMessage, key: string) => {
            return reacted ? channel.deleteReaction(msg, key) : channel.addReaction(msg, key);
          };

          action(message, emojiKey).catch((error) => {
            Logger.warn('Failed to reaction', error);
          });
        }
        await onClose();
      }}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.button, { backgroundColor: reacted || pressed ? selectedBackground : enabledBackground }]}
    >
      <Image source={{ uri: url }} style={styles.emoji} />
    </Pressable>
  );
};

const NUM_COLUMN = 6;
const ReactionListBottomSheet = ({ visible, onClose, onDismiss, reactionCtx, chatCtx }: ReactionBottomSheetProps) => {
  const { width } = useWindowDimensions();
  const safeArea = useSafeAreaPadding(['bottom', 'left', 'right']);
  const { colors } = useUIKitTheme();

  const { currentUser, emojiManager } = chatCtx;
  const { channel, message } = reactionCtx;
  const color = colors.ui.reaction.default;

  return (
    <Modal
      type={'slide'}
      visible={Boolean(visible && channel && message)}
      onClose={onClose}
      onDismiss={onDismiss}
      backgroundStyle={styles.modal}
    >
      <View
        style={[
          styles.container,
          {
            width,
            paddingBottom: safeArea.paddingBottom,
            backgroundColor: colors.ui.dialog.default.none.background,
            paddingStart: safeArea.paddingStart + styles.container.paddingHorizontal,
            paddingEnd: safeArea.paddingEnd + styles.container.paddingHorizontal,
          },
        ]}
      >
        <FlatList
          data={emojiManager.allEmoji}
          numColumns={NUM_COLUMN}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.flatlist}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item: { key, url } }) => {
            return (
              <View style={styles.emojiItem}>
                <ReactionEmojiPressable
                  emojiKey={key}
                  url={url}
                  message={message}
                  channel={channel}
                  currentUserId={currentUser?.userId}
                  selectedBackground={color.selected.background}
                  enabledBackground={color.enabled.background}
                  onClose={onClose}
                />
              </View>
            );
          }}
        />
      </View>
    </Modal>
  );
};

const styles = createStyleSheet({
  container: {
    overflow: 'hidden',
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    paddingTop: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  flatlist: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  emojiItem: {
    width: `${100 / NUM_COLUMN}%`,
    alignItems: 'center',
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

export default ReactionListBottomSheet;
