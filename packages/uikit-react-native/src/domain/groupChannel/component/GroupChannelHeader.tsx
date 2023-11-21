import React, { useContext } from 'react';
import { View } from 'react-native';

import { Header, Icon, createStyleSheet, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import ChannelCover from '../../../components/ChannelCover';
import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';
import { TypingIndicatorType } from '../../../types';
import { GroupChannelContexts } from '../module/moduleContext';
import type { GroupChannelProps } from '../types';

const GroupChannelHeader = ({
  shouldHideRight,
  onPressHeaderLeft,
  onPressHeaderRight,
}: GroupChannelProps['Header']) => {
  const { sbOptions } = useSendbirdChat();
  const { headerTitle, channel } = useContext(GroupChannelContexts.Fragment);
  const { typingUsers } = useContext(GroupChannelContexts.TypingIndicator);
  const { STRINGS } = useLocalization();
  const { HeaderComponent } = useHeaderStyle();

  const renderSubtitle = () => {
    const subtitle = STRINGS.LABELS.TYPING_INDICATOR_TYPINGS(typingUsers);

    if (!subtitle) return null;
    if (!sbOptions.uikit.groupChannel.channel.enableTypingIndicator) return null;
    if (!sbOptions.uikit.groupChannel.channel.typingIndicatorTypes.has(TypingIndicatorType.Text)) return null;

    return <Header.Subtitle style={styles.subtitle}>{subtitle}</Header.Subtitle>;
  };

  const isHidden = shouldHideRight();

  return (
    <HeaderComponent
      clearTitleMargin
      title={
        <View style={styles.titleContainer}>
          <ChannelCover channel={channel} size={34} containerStyle={styles.avatarGroup} />
          <View style={{ flexShrink: 1 }}>
            <Header.Title h2>{headerTitle}</Header.Title>
            {renderSubtitle()}
          </View>
        </View>
      }
      left={<Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
      right={isHidden ? null : <Icon icon={'info'} />}
      onPressRight={isHidden ? undefined : onPressHeaderRight}
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
