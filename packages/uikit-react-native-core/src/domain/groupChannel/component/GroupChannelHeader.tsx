import React, { useContext } from 'react';
import { View } from 'react-native';

import { Header as DefaultHeader, Icon, createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import { truncate } from '@sendbird/uikit-utils';

import ChannelCover from '../../../components/ChannelCover';
import { useLocalization } from '../../../contexts/Localization';
import { GroupChannelContexts } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const GroupChannelHeader: React.FC<GroupChannelProps['Header']> = ({
  Header = DefaultHeader,
  onPressHeaderLeft,
  onPressHeaderRight,
}) => {
  const { headerTitle, channel } = useContext(GroupChannelContexts.Fragment);
  const { typingUsers } = useContext(GroupChannelContexts.TypingIndicator);
  const { STRINGS } = useLocalization();

  if (!Header) return null;

  const subtitle = STRINGS.LABELS.TYPING_INDICATOR_TYPINGS(typingUsers);
  return (
    <Header
      clearTitleMargin
      title={
        <View style={styles.titleContainer}>
          <ChannelCover channel={channel} size={34} containerStyle={styles.avatarGroup} />
          <View>
            <DefaultHeader.Title h2>{truncate(headerTitle, { mode: 'tail', maxLen: 25 })}</DefaultHeader.Title>
            {Boolean(subtitle) && subtitle && (
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
