import React from 'react';


/**
 * SendbirdChatProvider
 * {@link https://sendbird.com/docs/uikit/v3/react-native/core-components/provider/sendbirdchatprovider#1-sendbirdchatprovider}
 * */
import { useConnection, useSendbirdChat } from '@gathertown/uikit-react-native';
import { Button, Text } from '@gathertown/uikit-react-native-foundation';

const Component = () => {
  const { currentUser, updateCurrentUserInfo } = useSendbirdChat();
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
