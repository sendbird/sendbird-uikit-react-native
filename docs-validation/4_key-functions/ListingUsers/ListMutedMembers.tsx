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
import { Text } from 'react-native';
const GroupChannelMutedMembersFragment2 = createGroupChannelMutedMembersFragment({
    Header: () => <Text>{'Custom Header'}</Text>,
    List: () => <Text>{'Custom List'}</Text>,
    StatusLoading: () => <Text>{'Custom Loading'}</Text>,
    StatusEmpty: () => <Text>{'Custom Empty'}</Text>,
    StatusError: () => <Text>{'Custom Error'}</Text>,
});
const GroupChannelMutedMembersScreen2 = ({ route: { params } }: any) => {
    const { sdk } = useSendbirdChat();
    const { channel } = useGroupChannel(sdk, params.channelUrl);
    if (!channel) return null;

    const navigateToBack = () => {};

    return <GroupChannelMutedMembersFragment channel={channel} onPressHeaderLeft={navigateToBack} />;
};
