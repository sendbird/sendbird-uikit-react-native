import React, { useContext } from 'react';
import { View } from 'react-native';

import { Avatar, Divider, Text, createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import {
  Logger,
  conditionChaining,
  getGroupChannelTitle,
  getMembersExcludeMe,
  preferDefaultChannelCover,
} from '@sendbird/uikit-utils';

import { useLocalization } from '../../../contexts/Localization';
import { useSendbirdChat } from '../../../contexts/SendbirdChat';
import { GroupChannelSettingsContext } from '../module/moduleContext';
import type { GroupChannelSettingsProps } from '../types';

const GroupChannelSettingsInfo: React.FC<GroupChannelSettingsProps['Info']> = () => {
  const { channel } = useContext(GroupChannelSettingsContext.Fragment);
  const { currentUser } = useSendbirdChat();
  const { LABEL } = useLocalization();

  if (!currentUser) {
    Logger.warn('Cannot render GroupChannelSettingsInfo, User is not connected');
    return null;
  }

  return (
    <View>
      <View style={styles.userInfoContainer}>
        {conditionChaining(
          [preferDefaultChannelCover(channel)],
          [
            <Avatar uri={channel.coverUrl} size={80} containerStyle={styles.avatarContainer} />,
            <Avatar.Group size={80} containerStyle={styles.avatarContainer}>
              {getMembersExcludeMe(channel, currentUser?.userId).map((m) => (
                <Avatar key={m.userId} uri={m.profileUrl} />
              ))}
            </Avatar.Group>,
          ],
        )}
        <Text h1 numberOfLines={1}>
          {getGroupChannelTitle(currentUser.userId, channel, LABEL.STRINGS.USER_NO_NAME)}
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
