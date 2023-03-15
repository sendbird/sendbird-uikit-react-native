const MyHeader = () => null;

/**
 *
 * {@link }
 * */
import React from 'react';

import { useOpenChannel } from '@sendbird/uikit-chat-hooks';
import { createOpenChannelOperatorsFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

const OpenChannelOperatorsFragment = createOpenChannelOperatorsFragment();
const OpenChannelOperatorsScreen = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToOpenChannelRegisterOperator = () => {};

  return (
    <OpenChannelOperatorsFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressHeaderRight={navigateToOpenChannelRegisterOperator}
    />
  );
};

/**
 *
 * {@link }
 * */
const OpenChannelOperatorsFragment2 = createOpenChannelOperatorsFragment({
  Header: () => <MyHeader />, // Use custom header
});
const OpenChannelOperatorsScreen2 = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToOpenChannelRegisterOperator = () => {};

  return (
    <OpenChannelOperatorsFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressHeaderRight={navigateToOpenChannelRegisterOperator}
    />
  );
};
