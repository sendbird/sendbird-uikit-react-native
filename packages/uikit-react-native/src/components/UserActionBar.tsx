import React from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

import { Avatar, Icon, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { conditionChaining } from '@sendbird/uikit-utils';

type Props = {
  uri: string;
  name: string;
  label?: string;

  muted: boolean;
  disabled: boolean;

  onPressActionMenu?: (ev: GestureResponderEvent) => void;
  onPressAvatar?: (ev: GestureResponderEvent) => void;
};
const UserActionBar = ({ muted, uri, name, disabled, label, onPressActionMenu, onPressAvatar }: Props) => {
  const { colors } = useUIKitTheme();

  const iconColor = conditionChaining([disabled], [colors.onBackground04, colors.onBackground01]);

  return (
    <View style={styles.container}>
      <Pressable onPress={onPressAvatar} style={styles.avatar}>
        <Avatar muted={muted} size={36} uri={uri} />
      </Pressable>
      <View style={[styles.infoContainer, { borderBottomColor: colors.onBackground04 }]}>
        <Text subtitle2 numberOfLines={1} style={styles.name} color={colors.onBackground01}>
          {name}
        </Text>
        {Boolean(label) && (
          <Text body2 color={colors.onBackground02} style={styles.label}>
            {label}
          </Text>
        )}
        {Boolean(onPressActionMenu) && (
          <TouchableOpacity onPress={onPressActionMenu} disabled={disabled}>
            <Icon color={iconColor} size={24} icon={'more'} containerStyle={styles.iconContainer} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
  },
  avatar: {
    marginLeft: 16,
    marginRight: 16,
  },
  label: {
    marginRight: 4,
  },
  infoContainer: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 12,
    borderBottomWidth: 1,
  },
  iconContainer: {
    padding: 4,
  },
  name: {
    flex: 1,
    marginRight: 8,
  },
});

export default UserActionBar;
