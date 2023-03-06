const MyHeader = () => null;

/**
 *
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/registering-as-operator-register-member-as-operators}
 * */
import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelRegisterOperatorFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

const GroupChannelRegisterOperatorFragment = createGroupChannelRegisterOperatorFragment();
const GroupChannelRegisterOperatorScreen = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToGroupChannelOperatorsScreen = () => {};

  return (
    <GroupChannelRegisterOperatorFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressHeaderRight={navigateToGroupChannelOperatorsScreen}
    />
  );
};

/**
 *
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/registering-as-operator-register-member-as-operators}
 * */
const GroupChannelRegisterOperatorFragment2 = createGroupChannelRegisterOperatorFragment({
    Header: () => <MyHeader />, // Use custom header
});
const GroupChannelRegisterOperatorScreen2 = ({ route: { params } }: any) => {
    const { sdk } = useSendbirdChat();
    const { channel } = useGroupChannel(sdk, params.channelUrl);
    if (!channel) return null;

    const navigateToBack = () => {};
    const navigateToGroupChannelOperatorsScreen = () => {};

    return (
        <GroupChannelRegisterOperatorFragment
            channel={channel}
            onPressHeaderLeft={navigateToBack}
            onPressHeaderRight={navigateToGroupChannelOperatorsScreen}
        />
    );
};
