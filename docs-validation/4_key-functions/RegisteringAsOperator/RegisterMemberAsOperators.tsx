
/**
 *
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/registering-as-operator-register-member-as-operators}
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
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/registering-as-operator-register-member-as-operators}
 * */
import { Text } from 'react-native';

const GroupChannelRegisterOperatorFragment2 = createGroupChannelRegisterOperatorFragment({
  Header: () => <Text>{'Custom Header'}</Text>,
  List: () => <Text>{'Custom List'}</Text>,
  StatusLoading: () => <Text>{'Custom Loading'}</Text>,
  StatusEmpty: () => <Text>{'Custom Empty'}</Text>,
  StatusError: () => <Text>{'Custom Error'}</Text>,
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
