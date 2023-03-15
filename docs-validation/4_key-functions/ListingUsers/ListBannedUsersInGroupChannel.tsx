const MyHeader = () => null;

/**
 *
 * {@link }
 * */
import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelBannedUsersFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

const GroupChannelBannedUsersFragment = createGroupChannelBannedUsersFragment();
const GroupChannelBannedUsersScreen = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};

  return <GroupChannelBannedUsersFragment channel={channel} onPressHeaderLeft={navigateToBack} />;
};

/**
 *
 * {@link }
 * */
const GroupChannelBannedUsersFragment2 = createGroupChannelBannedUsersFragment({
    Header: () => <MyHeader />, // Use custom header
});
const GroupChannelBannedUsersScreen2 = ({ route: { params } }: any) => {
    const { sdk } = useSendbirdChat();
    const { channel } = useGroupChannel(sdk, params.channelUrl);
    if (!channel) return null;

    const navigateToBack = () => {};

    return <GroupChannelBannedUsersFragment channel={channel} onPressHeaderLeft={navigateToBack} />;
};
