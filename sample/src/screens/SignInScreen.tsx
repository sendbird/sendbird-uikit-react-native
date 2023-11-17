import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { SessionHandler } from '@sendbird/chat';
import { useConnection, useSendbirdChat } from '@sendbird/uikit-react-native';
import { Button, Text, TextInput, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import Versions from '../components/Versions';
import { SendbirdAPI } from '../factory';
import { useAppAuth } from '../libs/authentication';

const SignInScreen = () => {
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');

  const { sdk } = useSendbirdChat();
  const { connect } = useConnection();

  const connectWith = async (userId: string, nickname?: string, useSessionToken = false) => {
    if (useSessionToken) {
      const sessionHandler = new SessionHandler();
      sessionHandler.onSessionTokenRequired = (onSuccess, onFail) => {
        SendbirdAPI.getSessionToken(userId)
          .then(({ token }) => onSuccess(token))
          .catch(onFail);
      };
      sdk.setSessionHandler(sessionHandler);

      const data = await SendbirdAPI.getSessionToken(userId);
      await connect(userId, { nickname, accessToken: data.token });
    } else {
      await connect(userId, { nickname });
    }
  };

  const { loading, signIn } = useAppAuth((user) => connectWith(user.userId, user.nickname));
  const { colors } = useUIKitTheme();

  if (loading) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image style={styles.logo} source={require('../assets/logoSendbird.png')} />
      <Text style={styles.title}>{'Sendbird RN-UIKit sample'}</Text>
      <TextInput
        placeholder={'User ID'}
        value={userId}
        onChangeText={setUserId}
        style={[styles.input, { backgroundColor: colors.onBackground04, marginBottom: 12 }]}
      />
      <TextInput
        placeholder={'Nickname'}
        value={nickname}
        onChangeText={setNickname}
        style={[styles.input, { backgroundColor: colors.onBackground04 }]}
      />
      <Button
        style={styles.btn}
        variant={'contained'}
        onPress={async () => {
          if (userId) {
            await signIn({ userId, nickname });
            await connectWith(userId, nickname);
          }
        }}
      >
        {'Sign in'}
      </Button>

      <Versions style={{ marginTop: 12 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 34,
  },
  btn: {
    width: '100%',
    paddingVertical: 16,
  },
  input: {
    width: '100%',
    borderRadius: 4,
    marginBottom: 32,
    paddingTop: 16,
    paddingBottom: 16,
  },
});

export default SignInScreen;
