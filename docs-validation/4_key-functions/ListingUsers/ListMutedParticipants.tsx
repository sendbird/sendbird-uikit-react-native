const MyHeader = () => null;

/**
 *
 * {@link }
 * */
import React from 'react';

import { useOpenChannel } from '@sendbird/uikit-chat-hooks';
import { createOpenChannelMutedParticipantsFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

const OpenChannelMutedParticipantsFragment = createOpenChannelMutedParticipantsFragment();
const OpenChannelMutedParticipantsScreen = ({ route: { params } }: any) => {
    const { sdk } = useSendbirdChat();
    const { channel } = useOpenChannel(sdk, params.channelUrl);
    if (!channel) return null;

    const navigateToBack = () => {};

    return <OpenChannelMutedParticipantsFragment channel={channel} onPressHeaderLeft={navigateToBack} />;
};

/**
 *
 * {@link }
 * */
const OpenChannelMutedParticipantsFragment2 = createOpenChannelMutedParticipantsFragment({
    Header: () => <MyHeader />, // Use custom header
});
const OpenChannelMutedParticipantsScreen2 = ({ route: { params } }: any) => {
    const { sdk } = useSendbirdChat();
    const { channel } = useOpenChannel(sdk, params.channelUrl);
    if (!channel) return null;

    const navigateToBack = () => {};

    return <OpenChannelMutedParticipantsFragment channel={channel} onPressHeaderLeft={navigateToBack} />;
};
