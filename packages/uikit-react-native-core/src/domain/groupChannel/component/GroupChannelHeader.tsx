import React, { useContext } from 'react';
import { View } from 'react-native';

import { Avatar, Header as DefaultHeader, Icon, createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import { truncate } from '@sendbird/uikit-utils';

import { useLocalization } from '../../../contexts/Localization';
import { GroupChannelContext } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const GroupChannelHeader: React.FC<GroupChannelProps['Header']> = ({
  Header = DefaultHeader,
  onPressHeaderLeft,
  onPressHeaderRight,
}) => {
  const { headerTitle, channel } = useContext(GroupChannelContext.Fragment);
  const { typingUsers } = useContext(GroupChannelContext.TypingIndicator);
  const { LABEL } = useLocalization();

  if (!Header) return null;

  const subtitle = LABEL.STRINGS.TYPING_INDICATOR_TYPINGS(typingUsers);
  return (
    <Header
      clearTitleMargin
      title={
        <View style={styles.titleContainer}>
          <Avatar.Group size={34} containerStyle={styles.avatarGroup}>
            {channel.members.slice(0, 4).map((m) => (
              <Avatar key={m.userId} uri={m.profileUrl} />
            ))}
          </Avatar.Group>
          <View>
            <DefaultHeader.Title h2>{truncate(headerTitle, { mode: 'tail', maxLen: 25 })}</DefaultHeader.Title>
            {subtitle && Boolean(subtitle) && (
              <DefaultHeader.SubTitle style={styles.subtitle}>{subtitle}</DefaultHeader.SubTitle>
            )}
          </View>
        </View>
      }
      left={<Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
      right={<Icon icon={'info'} />}
      onPressRight={onPressHeaderRight}
    />
  );
};

const styles = createStyleSheet({
  titleContainer: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGroup: {
    marginRight: 8,
  },
  subtitle: {
    marginTop: 2,
  },
});

export default GroupChannelHeader;
