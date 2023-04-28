import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useConnection } from '@sendbird/uikit-react-native';
import { Button, Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import HomeListItem from '../components/HomeListItem';
import Versions from '../components/Versions';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useAppAuth } from '../libs/authentication';
import { Routes } from '../libs/navigation';

const HomeItems = [
  {
    image: require('../assets/imgGroupchannel.png'),
    title: 'Group channel',
    desc: '1 on 1, Group chat with members',
    route: Routes.GroupChannelTabs,
  },
  {
    image: require('../assets/imgOpenchannel.png'),
    title: 'Open channel',
    desc: 'Live streams, Open community chat',
    route: Routes.OpenChannelTabs,
  },
  {
    image: undefined,
    title: 'Storybook',
    desc: '',
    route: Routes.Storybook,
  },
  {
    image: undefined,
    title: 'Palette',
    desc: '',
    route: Routes.Palette,
  },
  {
    image: undefined,
    title: 'Themed colors',
    desc: '',
    route: Routes.ThemeColors,
  },
] as const;

const HomeScreen = () => {
  const { top, bottom, left, right } = useSafeAreaInsets();
  const { navigation } = useAppNavigation();
  const { signOut } = useAppAuth();
  const { disconnect } = useConnection();
  const { select, colors } = useUIKitTheme();

  return (
    <FlatList
      style={{ backgroundColor: select({ light: '#F0F0F0', dark: '#0F0F0F' }), marginTop: top }}
      contentContainerStyle={{
        paddingTop: 32,
        paddingBottom: 32 + bottom,
        paddingLeft: 24 + left,
        paddingRight: 24 + right,
      }}
      data={HomeItems}
      keyExtractor={(k) => k.title}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => {
        if (item.image) {
          return (
            <HomeListItem
              image={item.image}
              title={item.title}
              desc={item.desc}
              onPress={() => navigation.navigate(item.route)}
            />
          );
        }

        return (
          <Pressable
            onPress={() => navigation.navigate(item.route)}
            style={[
              styles.customSampleButton,
              { backgroundColor: select({ light: colors.background, dark: colors.onBackground04 }) },
            ]}
          >
            <Text h2>{item.title}</Text>
          </Pressable>
        );
      }}
      ListHeaderComponent={<Text style={styles.screenTitle}>{'Home'}</Text>}
      ListFooterComponent={
        <View style={styles.footer}>
          <View style={styles.divider} />
          <Button
            variant={'contained'}
            style={styles.btn}
            onPress={async () => {
              await signOut();
              await disconnect();
            }}
          >
            {'Sign out'}
          </Button>
          <Versions style={{ marginTop: 12 }} />
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: 'red',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  separator: {
    height: 16,
  },
  divider: {
    marginVertical: 32,
    height: 1,
    backgroundColor: 'rgba(122,122,122,0.2)',
  },
  customSampleButton: {
    paddingHorizontal: 24,
    paddingVertical: 22,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 4,
    borderRadius: 8,
  },
  footer: {
    marginTop: 16,
  },
  btn: {
    width: '100%',
    paddingVertical: 16,
  },
});

export default HomeScreen;
