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
import { Text } from 'react-native';
const GroupChannelOperatorsFragment2 = createGroupChannelOperatorsFragment({
  Header: () => <Text>{'Custom Header'}</Text>,
  List: () => <Text>{'Custom List'}</Text>,
  StatusLoading: () => <Text>{'Custom Loading'}</Text>,
  StatusEmpty: () => <Text>{'Custom Empty'}</Text>,
  StatusError: () => <Text>{'Custom Error'}</Text>,
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
