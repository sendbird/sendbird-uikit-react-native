import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';

import { useLocalization } from '../../hooks/useContext';

type Props = {
  message: SendbirdMessage;
  grouping: boolean;
  style?: StyleProp<ViewStyle>;
};
const MessageTime = ({ message, grouping, style }: Props) => {
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();
  if (grouping) return null;

  return (
    <View style={style}>
      <Text caption4 color={colors.ui.message.incoming.enabled.textTime}>
        {STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_TIME(message)}
      </Text>
    </View>
  );
};

export default MessageTime;
