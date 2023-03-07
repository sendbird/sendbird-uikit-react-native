const MyHeader = () => null;

/**
 *
 * {@link }
 * */
import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelOperatorsFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

const GroupChannelOperatorsFragment = createGroupChannelOperatorsFragment();
const GroupChannelOperatorsScreen = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToGroupChannelRegisterOperator = () => {};

  return (
    <GroupChannelOperatorsFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressHeaderRight={navigateToGroupChannelRegisterOperator}
    />
  );
};

/**
 *
 * {@link }
 * */
const GroupChannelOperatorsFragment2 = createGroupChannelOperatorsFragment({
  Header: () => <MyHeader />, // Use custom header
});
const GroupChannelOperatorsScreen2 = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToGroupChannelRegisterOperator = () => {};

  return (
    <GroupChannelOperatorsFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressHeaderRight={navigateToGroupChannelRegisterOperator}
    />
  );
};
