import React from 'react';

import { Button, Text } from '@sendbird/uikit-react-native-foundation';

/**
 * SendbirdChatProvider
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/provider/sendbirdchatprovider#1-sendbirdchatprovider}
 * */
// TODO: import useSendbirdChat, useConnection, React
// TODO: remove sdk
const Component = () => {
  const { sdk, currentUser, updateCurrentUserInfo } = useSendbirdChat();
  const { connect, disconnect } = useConnection();

  if (!currentUser) {
    return <Button onPress={() => connect('USER_ID', { nickname: 'NICKNAME' })}>{'Connect'}</Button>;
  }

  return (
    <>
      <Text>{currentUser.nickname}</Text>
      <Button onPress={() => updateCurrentUserInfo('UPDATED_NICKNAME')}>{'Update nickname'}</Button>
      <Button onPress={() => disconnect()}>{'Disconnect'}</Button>
    </>
  );
};
/** ------------------ **/
