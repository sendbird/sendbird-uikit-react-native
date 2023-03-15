import React, { useContext } from 'react';

import { Box, Divider, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { getOpenChannelTitle } from '@sendbird/uikit-utils';

import ChannelCover from '../../../components/ChannelCover';
import { useLocalization } from '../../../hooks/useContext';
import { OpenChannelSettingsContexts } from '../module/moduleContext';
import type { OpenChannelSettingsProps } from '../types';

const OpenChannelSettingsInfo = (_: OpenChannelSettingsProps['Info']) => {
  const { channel } = useContext(OpenChannelSettingsContexts.Fragment);
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();

  return (
    <Box>
      <Box paddingVertical={24} alignItems={'center'}>
        <ChannelCover channel={channel} size={80} containerStyle={styles.avatarContainer} />
        <Text h1 numberOfLines={1}>
          {getOpenChannelTitle(channel) || ' '}
        </Text>
      </Box>
      <Divider />

      <Box paddingVertical={16}>
        <Text body2 color={colors.onBackground02} style={styles.infoUrl}>
          {STRINGS.OPEN_CHANNEL_SETTINGS.INFO_URL}
        </Text>
        <Text body3 color={colors.onBackground01}>
          {channel.url}
        </Text>
      </Box>
      <Divider />
    </Box>
  );
};

const styles = createStyleSheet({
  avatarContainer: {
    marginBottom: 12,
  },
  infoUrl: {
    marginBottom: 4,
  },
});
export default OpenChannelSettingsInfo;
