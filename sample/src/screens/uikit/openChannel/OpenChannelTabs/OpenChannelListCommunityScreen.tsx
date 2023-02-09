import React from 'react';

import { createOpenChannelListFragment, useSendbirdChat } from '@sendbird/uikit-react-native';
import { Icon, useHeaderStyle } from '@sendbird/uikit-react-native-foundation';

import { useAppNavigation } from '../../../../hooks/useAppNavigation';
import { Routes } from '../../../../libs/navigation';
import { OpenChannelCustomType } from '../../../../libs/openChannel';

const OpenChannelListFragment = createOpenChannelListFragment({
  Header: ({ onPressHeaderRight }) => {
    const { HeaderComponent } = useHeaderStyle();
    return <HeaderComponent title={'Community'} right={<Icon icon={'create'} />} onPressRight={onPressHeaderRight} />;
  },
});
const OpenChannelListCommunityScreen = () => {
  const { sdk } = useSendbirdChat();
  const { navigation } = useAppNavigation<Routes.OpenChannelListCommunity>();

  return (
    <OpenChannelListFragment
      onPressCreateChannel={() => {
        // Navigating to open channel create
        navigation.navigate(Routes.OpenChannelCreate);
      }}
      onPressChannel={(channel) => {
        // Navigating to open channel
        navigation.navigate(Routes.OpenChannel, { channelUrl: channel.url });
      }}
      queryCreator={() => {
        return sdk.openChannel.createOpenChannelListQuery({
          customTypes: [OpenChannelCustomType.COMMUNITY],
        });
      }}
    />
  );
};

export default OpenChannelListCommunityScreen;
