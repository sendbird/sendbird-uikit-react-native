import React, { useContext } from 'react';
import { View } from 'react-native';

import { Icon, Text, createStyleSheet, useHeaderStyle, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';
import { GroupChannelThreadContexts } from '../module/moduleContext';
import type { GroupChannelThreadProps } from '../types';

const GroupChannelThreadHeader = ({ onPressLeft, onPressSubtitle }: GroupChannelThreadProps['Header']) => {
  const { headerTitle, channel } = useContext(GroupChannelThreadContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  const { STRINGS } = useLocalization();
  const { select, colors, palette } = useUIKitTheme();
  const { currentUser } = useSendbirdChat();

  const renderSubtitle = () => {
    if (!currentUser) return null;

    return (
      <Text
        onPress={onPressSubtitle}
        caption2
        style={styles.subtitle}
        color={select({ light: palette.primary300, dark: palette.primary200 })}
        numberOfLines={1}
      >
        {STRINGS.GROUP_CHANNEL_THREAD.HEADER_SUBTITLE(currentUser.userId, channel)}
      </Text>
    );
  };

  return (
    <HeaderComponent
      clearTitleMargin
      title={
        <View style={styles.titleContainer}>
          <View style={{ flexShrink: 1 }}>
            <Text h2 color={colors.onBackground01} numberOfLines={1}>
              {headerTitle}
            </Text>
            {renderSubtitle()}
          </View>
        </View>
      }
      left={<Icon icon={'arrow-left'} size={24} />}
      onPressLeft={onPressLeft}
    />
  );
};

const styles = createStyleSheet({
  titleContainer: {
    maxWidth: '100%',
    flexDirection: 'row',
    width: '100%',
  },
  subtitle: {
    marginTop: 2,
  },
});

export default GroupChannelThreadHeader;
