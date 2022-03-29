import React, { useLayoutEffect } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';

import { usePushTrigger } from '@sendbird/chat-react-hooks';
import { usePlatformService, useSendbirdChat } from '@sendbird/uikit-react-native-core';
import {
  Avatar,
  Divider,
  Header,
  MenuBar,
  MenuBarProps,
  Switch,
  Text,
  useActionMenu,
  usePrompt,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { useBottomSheet } from '@sendbird/uikit-react-native-foundation/src/ui/Dialog';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import useAppearance from '../../../hooks/useAppearance';
import { Routes } from '../../../libs/navigation';

const SettingsScreen = () => {
  const { navigation } = useAppNavigation<Routes.Settings>();
  const { scheme, setScheme } = useAppearance();

  const { currentUser, setCurrentUser, sdk } = useSendbirdChat();
  const { option, updateOption } = usePushTrigger(sdk);
  const { fileService } = usePlatformService();

  const { colors, palette } = useUIKitTheme();

  const { openSheet } = useBottomSheet();
  const { prompt } = usePrompt();
  const { openMenu } = useActionMenu();

  const onChangeNickname = () => {
    prompt({
      title: 'Change nickname',
      submitLabel: 'Save',
      placeholder: 'Enter name',
      defaultValue: currentUser?.nickname ?? '',
      onSubmit: async (nickname) => {
        const user = await sdk.updateCurrentUserInfo(nickname, sdk.currentUser.plainProfileUrl);
        setCurrentUser(user);
      },
    });
  };
  const onChangeProfileImage = () => {
    openMenu({
      title: 'Change profile image',
      menuItems: [
        {
          title: 'Take photo',
          onPress: async () => {
            const file = await fileService.openCamera();
            if (!file) return;

            const user = await sdk.updateCurrentUserInfoWithProfileImage(sdk.currentUser.nickname, file);
            setCurrentUser(user);
          },
        },
        {
          title: 'Choose photo',
          onPress: async () => {
            const files = await fileService.openMediaLibrary({ selectionLimit: 1 });
            if (!files || !files[0]) return;

            const user = await sdk.updateCurrentUserInfoWithProfileImage(sdk.currentUser.nickname, files[0]);
            setCurrentUser(user);
          },
        },
      ],
    });
  };

  const onEdit = () => {
    openSheet({
      sheetItems: [
        { title: 'Change nickname', onPress: onChangeNickname },
        { title: 'Change profile image', onPress: onChangeProfileImage },
      ],
    });
  };
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

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  if (!currentUser) return null;

  return (
    <View style={styles.container}>
      <Header
        title={'My settings'}
        right={<Header.Button color={colors.primary}>{'Edit'}</Header.Button>}
        onPressRight={onEdit}
      />
      <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.viewContainer}>
        <View style={styles.userInfoContainer}>
          <Avatar uri={currentUser.plainProfileUrl} size={80} containerStyle={styles.avatarContainer} />
          <Text h1 numberOfLines={1}>
            {currentUser.nickname}
          </Text>
        </View>
        <Divider />
        <View style={styles.userIdContainer}>
          <Text body2 color={colors.onBackground02} style={styles.userIdLabel}>
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
              variant={'contained'}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  viewContainer: { paddingHorizontal: 16 },
  userInfoContainer: { paddingVertical: 24, alignItems: 'center' },
  avatarContainer: { marginBottom: 12 },
  userIdContainer: { paddingVertical: 16 },
  userIdLabel: { marginBottom: 4 },
});

export default SettingsScreen;
