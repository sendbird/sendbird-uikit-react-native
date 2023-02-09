import React, { useContext } from 'react';

import { Box, Header, Icon, createStyleSheet, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { useLocalization } from '../../..//hooks/useContext';
import ChannelCover from '../../../components/ChannelCover';
import { OpenChannelContexts } from '../module/moduleContext';
import type { OpenChannelProps } from '../types';

const OpenChannelHeader = ({ onPressHeaderLeft, onPressHeaderRight, rightIconName }: OpenChannelProps['Header']) => {
  const { headerTitle, channel } = useContext(OpenChannelContexts.Fragment);
  const { HeaderComponent } = useHeaderStyle();
  const { STRINGS } = useLocalization();

  return (
    <HeaderComponent
      clearTitleMargin
      title={
        <Box flexDirection={'row'} alignItems={'center'} style={styles.titleContainer}>
          <ChannelCover channel={channel} size={34} containerStyle={styles.avatarGroup} />
          <Box flexShrink={1}>
            <Header.Title h2>{headerTitle}</Header.Title>
            <Header.Subtitle style={styles.subtitle}>{STRINGS.OPEN_CHANNEL.HEADER_SUBTITLE(channel)}</Header.Subtitle>
          </Box>
        </Box>
      }
      left={<Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
      right={<Icon icon={rightIconName} />}
      onPressRight={onPressHeaderRight}
    />
  );
};

const styles = createStyleSheet({
  titleContainer: {
    maxWidth: '100%',
  },
  avatarGroup: {
    marginRight: 8,
  },
  subtitle: {
    marginTop: 2,
  },
});

export default React.memo(OpenChannelHeader);
