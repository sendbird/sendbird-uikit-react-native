const MyHeader = () => null;

/**
 *
 * {@link }
 * */
import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelMutedMembersFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

const GroupChannelMutedMembersFragment = createGroupChannelMutedMembersFragment();
const GroupChannelMutedMembersScreen = ({ route: { params } }: any) => {
    const { sdk } = useSendbirdChat();
    const { channel } = useGroupChannel(sdk, params.channelUrl);
    if (!channel) return null;

    const navigateToBack = () => {};

    return <GroupChannelMutedMembersFragment channel={channel} onPressHeaderLeft={navigateToBack} />;
};

/**
 *
 * {@link }
 * */
const GroupChannelMutedMembersFragment2 = createGroupChannelMutedMembersFragment({
    Header: () => <MyHeader />, // Use custom header
});
const GroupChannelMutedMembersScreen2 = ({ route: { params } }: any) => {
    const { sdk } = useSendbirdChat();
    const { channel } = useGroupChannel(sdk, params.channelUrl);
    if (!channel) return null;

    const navigateToBack = () => {};

    return <GroupChannelMutedMembersFragment channel={channel} onPressHeaderLeft={navigateToBack} />;
};
