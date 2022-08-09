import React, { useContext } from 'react';
import { View } from 'react-native';

import { Header, Icon, createStyleSheet, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import ChannelCover from '../../../components/ChannelCover';
import { useLocalization } from '../../../hooks/useContext';
import { GroupChannelContexts } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const GroupChannelHeader = ({ onPressHeaderLeft, onPressHeaderRight }: GroupChannelProps['Header']) => {
  const { headerTitle, channel } = useContext(GroupChannelContexts.Fragment);
  const { typingUsers } = useContext(GroupChannelContexts.TypingIndicator);
  const { STRINGS } = useLocalization();
  const { HeaderComponent } = useHeaderStyle();
  const subtitle = STRINGS.LABELS.TYPING_INDICATOR_TYPINGS(typingUsers);

  return (
    <HeaderComponent
      clearTitleMargin
      title={
        <View style={styles.titleContainer}>
          <ChannelCover channel={channel} size={34} containerStyle={styles.avatarGroup} />
          <View style={{ flexShrink: 1 }}>
            <Header.Title h2>{headerTitle}</Header.Title>
            {Boolean(subtitle) && subtitle && <Header.Subtitle style={styles.subtitle}>{subtitle}</Header.Subtitle>}
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
