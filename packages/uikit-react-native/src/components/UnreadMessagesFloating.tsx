import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';

import { Icon, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { useLocalization } from '../hooks/useContext';

export type UnreadMessagesFloatingProps = {
  unreadMessageCount: number;
  visible: boolean;
  onPressClose: () => void;
};
const UnreadMessagesFloating = ({ unreadMessageCount, visible, onPressClose }: UnreadMessagesFloatingProps) => {
  const { STRINGS } = useLocalization();
  const { select, palette, colors } = useUIKitTheme();
  if (unreadMessageCount <= 0 || !visible) return null;
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: select({ dark: palette.background400, light: palette.background50 }) },
      ]}
    >
      <Text body2 color={colors.onBackground02}>
        {STRINGS.GROUP_CHANNEL.LIST_FLOATING_UNREAD_MSG(unreadMessageCount)}
      </Text>
      <TouchableOpacity onPress={onPressClose} style={{ marginLeft: 4 }}>
        <Icon icon={'close'} size={14} />
      </TouchableOpacity>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: 'black',
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
      },
    }),
  },
});

export default React.memo(UnreadMessagesFloating);
