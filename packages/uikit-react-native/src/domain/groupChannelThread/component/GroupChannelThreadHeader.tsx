import React, { useContext } from 'react';
import { View } from 'react-native';

import { createStyleSheet, Icon, Text, useHeaderStyle, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { GroupChannelThreadContexts } from '../module/moduleContext';
import type { GroupChannelThreadProps } from '../types';
import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';

const GroupChannelThreadHeader = ({ onPressHeaderLeft }: GroupChannelThreadProps['Header']) => {
  const { headerTitle, channel } = useContext(GroupChannelThreadContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  const { STRINGS } = useLocalization();
  const { select, colors, palette } = useUIKitTheme();
  const { currentUser } = useSendbirdChat();
  
  const renderSubtitle = () => {
    if (!currentUser) return null;
    
    return (<Text caption2 style={styles.subtitle} color={select({ light: palette.primary300, dark: palette.primary200 })} numberOfLines={1}>
      {STRINGS.GROUP_CHANNEL_THREAD.HEADER_SUBTITLE(currentUser.userId, channel)}
    </Text>);
  };
  
  return (
    <HeaderComponent
      clearTitleMargin
      title={
        <View style={styles.titleContainer}>
          <View style={{ flexShrink: 1 }}>
            <Text h2 color={colors.onBackground01} numberOfLines={1}>{headerTitle}</Text>
            {renderSubtitle()}
          </View>
        </View>
      }
      left={<Icon icon={'arrow-left'} size={24} />}
      onPressLeft={onPressHeaderLeft}
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
