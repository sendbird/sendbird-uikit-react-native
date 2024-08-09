const MyHeader = () => null;

/**
 *
 * {@link }
 * */
import React from 'react';

import { useOpenChannel } from '@sendbird/uikit-chat-hooks';
import { createOpenChannelBannedUsersFragment, useSendbirdChat } from "@sendbird/uikit-react-native";

const OpenChannelBannedUsersFragment = createOpenChannelBannedUsersFragment();
const OpenChannelBannedUsersScreen = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};

  return <OpenChannelBannedUsersFragment channel={channel} onPressHeaderLeft={navigateToBack} />;
};

/**
 *
 * {@link }
 * */
import { Text } from 'react-native';
const OpenChannelBannedUsersFragment2 = createOpenChannelBannedUsersFragment({
  Header: () => <Text>{'Custom Header'}</Text>,
  List: () => <Text>{'Custom List'}</Text>,
  StatusLoading: () => <Text>{'Custom Loading'}</Text>,
  StatusEmpty: () => <Text>{'Custom Empty'}</Text>,
  StatusError: () => <Text>{'Custom Error'}</Text>,
});
const OpenChannelBannedUsersScreen2 = ({ route: { params } }: any) => {
    const { sdk } = useSendbirdChat();
    const { channel } = useOpenChannel(sdk, params.channelUrl);
    if (!channel) return null;

    const navigateToBack = () => {};

    return <OpenChannelBannedUsersFragment channel={channel} onPressHeaderLeft={navigateToBack} />;
};
