import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useLocalization } from '@sendbird/uikit-react-native-core';
import { Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';

type Props = { message: SendbirdMessage; grouping: boolean; style?: StyleProp<ViewStyle> };
const MessageTime: React.FC<Props> = ({ message, grouping, style }) => {
  const { LABEL } = useLocalization();
  const { colors } = useUIKitTheme();
  if (grouping) return null;

  return (
    <View style={style}>
      <Text caption4 color={colors.ui.message.incoming.enabled.textTime}>
        {LABEL.GROUP_CHANNEL.MESSAGE_BUBBLE_TIME(message)}
      </Text>
    </View>
  );
};

export default MessageTime;
