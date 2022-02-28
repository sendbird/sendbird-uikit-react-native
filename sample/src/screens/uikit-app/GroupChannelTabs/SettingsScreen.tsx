import React, { useLayoutEffect } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';

import { usePushTrigger } from '@sendbird/chat-react-hooks';
import { useConnection, useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Avatar, Divider, Header, Switch, Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import MenuBar, { MenuBarProps } from '../../../components/MenuBar';
import { Routes, useAppNavigation } from '../../../hooks/useAppNavigation';
import useAppearance from '../../../hooks/useAppearance';

const SettingsScreen = () => {
  const { navigation } = useAppNavigation<Routes.Settings>();
  const { scheme, setScheme } = useAppearance();

  const { colors, palette } = useUIKitTheme();

  const { disconnect } = useConnection();
  const { currentUser, sdk } = useSendbirdChat();
  const { option, updateOption } = usePushTrigger(sdk);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const onToggleDisturb = async () => {
    const isNextOff = option !== 'off';
    await updateOption(isNextOff ? 'off' : 'all');
  };

  const onToggleTheme = () => {
    const isNextDark = scheme !== 'dark';
    StatusBar.setBarStyle(isNextDark ? 'light-content' : 'dark-content', true);
    setScheme(isNextDark ? 'dark' : 'light');
  };

  const onExitToHome = async () => {
    navigation.navigate(Routes.Home);
    await disconnect();
  };

  const menuItems: MenuBarProps[] = [
    {
      icon: 'theme',
      name: 'Dark theme',
      onPress: onToggleTheme,
      actionItem: <Switch value={scheme === 'dark'} onChangeValue={onToggleTheme} />,
    },
    {
      icon: 'notifications-filled',
      iconBackgroundColor: palette.secondary400,
      name: 'Do not disturb',
      onPress: onToggleDisturb,
      actionItem: <Switch value={option === 'off'} onChangeValue={onToggleDisturb} />,
    },
    {
      icon: 'leave',
      iconBackgroundColor: palette.error300,
      name: 'Exit to home',
      onPress: onExitToHome,
    },
  ];

  if (!currentUser) return null;

  return (
    <View style={{ flex: 1 }}>
      <Header title={'My settings'} right={<Header.Button color={colors.primary}>{'Edit'}</Header.Button>} />
      <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ paddingHorizontal: 16 }}>
        <View style={{ paddingVertical: 24, alignItems: 'center' }}>
          <Avatar uri={currentUser.profileUrl} size={80} containerStyle={{ marginBottom: 12 }} />
          <Text h1 numberOfLines={1}>
            {currentUser.nickname}
          </Text>
        </View>
        <Divider />
        <View style={{ paddingVertical: 16 }}>
          <Text body2 color={colors.onBackground02} style={{ marginBottom: 4 }}>
            {'User ID'}
          </Text>
          <Text body3 numberOfLines={1}>
            {currentUser.userId}
          </Text>
        </View>
        <Divider />

        {menuItems.map((menu) => {
          return (
            <MenuBar
              key={menu.name}
              icon={menu.icon}
              onPress={menu.onPress}
              name={menu.name}
              disabled={menu.disabled}
              iconBackgroundColor={menu.iconBackgroundColor}
              actionLabel={menu.actionLabel}
              actionItem={menu.actionItem}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
