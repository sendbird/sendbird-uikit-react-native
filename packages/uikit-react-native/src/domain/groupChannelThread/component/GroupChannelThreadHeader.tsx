import React, { useContext } from 'react';
import { View } from 'react-native';

import { Header, Icon, createStyleSheet, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { GroupChannelThreadContexts } from '../module/moduleContext';
import type { GroupChannelThreadProps } from '../types';
import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';

const GroupChannelThreadHeader = ({
                              onPressHeaderLeft,
                            }: GroupChannelThreadProps['Header']) => {
  const { headerTitle, channel } = useContext(GroupChannelThreadContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  const { STRINGS } = useLocalization();
  const { currentUser } = useSendbirdChat();
  
  const renderSubtitle = () => {
    if(!currentUser) return null;
    return <Header.Subtitle style={styles.subtitle}>{STRINGS.GROUP_CHANNEL_THREAD.HEADER_SUBTITLE(currentUser.userId, channel)}</Header.Subtitle>;
  };
  
  return (
    <HeaderComponent
      titleAlign={'center'}
      clearTitleMargin
      title={
        <View style={styles.titleContainer}>
          <View style={{ flexShrink: 1 }}>
            <Header.Title h2>{headerTitle}</Header.Title>
            {renderSubtitle()}
          </View>
        </View>
      }
      left={<Icon icon={'arrow-left'} />}
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
