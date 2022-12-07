import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Icon, Image, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { truncatedCount } from '@sendbird/uikit-utils';

type Props = {
  url: string;
  count: number;
  reacted: boolean;
  style: StyleProp<ViewStyle>;
};

const ReactionRoundedButton = ({ url, count, reacted, style }: Props) => {
  const { colors } = useUIKitTheme();
  const color = colors.ui.reaction.rounded;

  return (
    <View
      style={[
        styles.reactionContainer,
        { backgroundColor: reacted ? color.selected.background : color.enabled.background },
        style,
      ]}
    >
      <Image source={{ uri: url }} style={styles.emoji} />
      <Text caption4 color={colors.onBackground01} numberOfLines={1} style={styles.count}>
        {truncatedCount(count, 99, '')}
      </Text>
    </View>
  );
};

ReactionRoundedButton.More = ({ pressed }: { pressed: boolean }) => {
  const { colors } = useUIKitTheme();
  const color = colors.ui.reaction.rounded;

  return (
    <View
      style={[
        styles.reactionContainer,
        { backgroundColor: pressed ? color.selected.background : color.enabled.background },
      ]}
    >
      <Icon icon={'emoji-more'} color={colors.onBackground03} size={20} />
    </View>
  );
};

const styles = createStyleSheet({
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 52,
    borderRadius: 24,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  emoji: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  count: {
    width: 13,
    textAlign: 'left',
  },
});

export default ReactionRoundedButton;
