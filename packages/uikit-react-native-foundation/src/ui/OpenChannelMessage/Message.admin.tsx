import React from 'react';

import type { SendbirdAdminMessage } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import Text from '../../components/Text';
import useUIKitTheme from '../../theme/useUIKitTheme';
import type { OpenChannelMessageProps } from './index';

const AdminMessage = (props: OpenChannelMessageProps<SendbirdAdminMessage>) => {
  const { colors } = useUIKitTheme();
  const color = colors.ui.openChannelMessage.default;
  return (
    <Box marginVertical={8} paddingHorizontal={12} backgroundColor={colors.background}>
      <Box borderRadius={8} paddingHorizontal={16} paddingVertical={14} backgroundColor={color.enabled.adminBackground}>
        <Text caption2 color={colors.onBackground02}>
          {props.message.message}
        </Text>
      </Box>
    </Box>
  );
};

export default AdminMessage;
