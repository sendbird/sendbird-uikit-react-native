const MyHeader = () => null;

/**
 *
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/registering-as-operator-register-participants-as-operators}
 * */
import React from 'react';

import { useOpenChannel } from '@sendbird/uikit-chat-hooks';
import { createOpenChannelRegisterOperatorFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

const OpenChannelRegisterOperatorFragment = createOpenChannelRegisterOperatorFragment();
const OpenChannelRegisterOperatorScreen = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToOpenChannelOperatorsScreen = () => {};

  return (
    <OpenChannelRegisterOperatorFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressHeaderRight={navigateToOpenChannelOperatorsScreen}
    />
  );
};

/**
 *
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/registering-as-operator-register-participants-as-operators}
 * */
import { Text } from 'react-native';

const OpenChannelRegisterOperatorFragment2 = createOpenChannelRegisterOperatorFragment({
  Header: () => <Text>{'Custom Header'}</Text>,
  List: () => <Text>{'Custom List'}</Text>,
  StatusLoading: () => <Text>{'Custom Loading'}</Text>,
  StatusEmpty: () => <Text>{'Custom Empty'}</Text>,
  StatusError: () => <Text>{'Custom Error'}</Text>,
});

const OpenChannelRegisterOperatorScreen2 = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToOpenChannelOperatorsScreen = () => {};

  return (
    <OpenChannelRegisterOperatorFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressHeaderRight={navigateToOpenChannelOperatorsScreen}
    />
  );
};
