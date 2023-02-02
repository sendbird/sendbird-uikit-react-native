import React, { useContext } from 'react';
import { View } from 'react-native';

import { Divider, Text, createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import { getOpenChannelTitle } from '@sendbird/uikit-utils';

import ChannelCover from '../../../components/ChannelCover';
import { OpenChannelSettingsContexts } from '../module/moduleContext';
import type { OpenChannelSettingsProps } from '../types';

const OpenChannelSettingsInfo = (_: OpenChannelSettingsProps['Info']) => {
  const { channel } = useContext(OpenChannelSettingsContexts.Fragment);

  return (
    <View>
      <View style={styles.userInfoContainer}>
        <ChannelCover channel={channel} size={80} containerStyle={styles.avatarContainer} />
        <Text h1 numberOfLines={1}>
          {getOpenChannelTitle(channel) || ' '}
        </Text>
      </View>
      <Divider />
    </View>
  );
};

const styles = createStyleSheet({
  container: { flex: 1 },
  userInfoContainer: { paddingVertical: 24, alignItems: 'center' },
  avatarContainer: { marginBottom: 12 },
  userIdContainer: { paddingVertical: 16 },
  userIdLabel: { marginBottom: 4 },
});
export default OpenChannelSettingsInfo;
