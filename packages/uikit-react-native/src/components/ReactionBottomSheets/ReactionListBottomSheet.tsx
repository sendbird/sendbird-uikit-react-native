import React from 'react';
import { FlatList, Pressable, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Image, Modal, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { UNKNOWN_USER_ID } from '../../constants';
import type { ReactionBottomSheetProps } from './index';

const NUM_COLUMN = 6;
const ReactionListBottomSheet = ({ visible, onClose, onDismiss, reactionCtx, chatCtx }: ReactionBottomSheetProps) => {
  const { width } = useWindowDimensions();
  const { bottom, left, right } = useSafeAreaInsets();
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
            paddingBottom: bottom,
            backgroundColor: colors.ui.dialog.default.none.background,
            paddingLeft: left + styles.container.paddingHorizontal,
            paddingRight: right + styles.container.paddingHorizontal,
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
            const reactedUserIds = message?.reactions?.find((it) => it.key === key)?.userIds ?? [];

            const idx = reactedUserIds.indexOf(currentUser?.userId ?? UNKNOWN_USER_ID);
            const reacted = idx > -1;

            return (
              <View style={styles.emojiItem}>
                <Pressable
                  key={key}
                  onPress={() => {
                    if (message && channel) {
                      if (reacted) channel.deleteReaction(message, key);
                      else channel.addReaction(message, key);
                    }
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: reacted || pressed ? color.selected.background : color.enabled.background },
                  ]}
                >
                  <Image source={{ uri: url }} style={styles.emoji} />
                </Pressable>
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
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
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
