import React, { useContext } from 'react';
import { View } from 'react-native';

import { Divider, Text, createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import { getGroupChannelTitle } from '@sendbird/uikit-utils';

import ChannelCover from '../../../components/ChannelCover';
import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';
import { GroupChannelSettingsContexts } from '../module/moduleContext';
import type { GroupChannelSettingsProps } from '../types';

const GroupChannelSettingsInfo = (_: GroupChannelSettingsProps['Info']) => {
  const { channel } = useContext(GroupChannelSettingsContexts.Fragment);
  const { currentUser } = useSendbirdChat();
  const { STRINGS } = useLocalization();

  return (
    <View>
      <View style={styles.userInfoContainer}>
        <ChannelCover channel={channel} size={80} containerStyle={styles.avatarContainer} />
        <Text h1 numberOfLines={1}>
          {getGroupChannelTitle(
            currentUser?.userId || '',
            channel,
            STRINGS.LABELS.USER_NO_NAME,
            STRINGS.LABELS.CHANNEL_NO_MEMBERS,
          )}
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
export default GroupChannelSettingsInfo;
