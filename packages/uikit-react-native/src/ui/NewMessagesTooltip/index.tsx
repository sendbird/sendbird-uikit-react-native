import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';

import { useLocalization } from '@sendbird/uikit-react-native-core';
import { Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';

type Props = {
  newMessages: SendbirdMessage[];
  visible: boolean;
  onPress: () => void;
};
const NewMessagesTooltip: React.FC<Props> = ({ newMessages, visible, onPress }) => {
  const { LABEL } = useLocalization();
  const { select, palette, colors } = useUIKitTheme();
  if (newMessages.length === 0 || !visible) return null;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: select({ dark: palette.background400, light: palette.background50 }) },
      ]}
    >
      <Text button color={colors.primary}>
        {LABEL.GROUP_CHANNEL.FRAGMENT.LIST_TOOLTIP_NEW_MSG(newMessages)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = createStyleSheet({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: 'black',
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
      },
    }),
  },
});
export default React.memo(NewMessagesTooltip);