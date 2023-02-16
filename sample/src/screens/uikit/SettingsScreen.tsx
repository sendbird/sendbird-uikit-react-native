import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePushTrigger } from '@sendbird/uikit-chat-hooks';
import { SBUError, SBUUtils, useLocalization, usePlatformService, useSendbirdChat } from '@sendbird/uikit-react-native';
import {
  Avatar,
  Divider,
  Header,
  MenuBar,
  MenuBarProps,
  Switch,
  Text,
  useActionMenu,
  useAlert,
  useBottomSheet,
  usePrompt,
  useToast,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import useAppearance from '../../hooks/useAppearance';
import { useAppAuth } from '../../libs/authentication';
import { Routes } from '../../libs/navigation';

const SettingsScreen = () => {
  const { navigation } = useAppNavigation<Routes.Settings>();
  const { scheme, setScheme } = useAppearance();
  const { left, right } = useSafeAreaInsets();

  const { currentUser, sdk, updateCurrentUserInfo } = useSendbirdChat();
  const { option, updateOption } = usePushTrigger(sdk);
  const { fileService } = usePlatformService();
  const { colors, palette } = useUIKitTheme();
  const { STRINGS } = useLocalization();
  const toast = useToast();
  const { openSheet } = useBottomSheet();
  const { openPrompt } = usePrompt();
  const { openMenu } = useActionMenu();
  const { alert } = useAlert();

  const { authManager } = useAppAuth();

  const onChangeNickname = () => {
    openPrompt({
      title: 'Change nickname',
      submitLabel: 'Save',
      placeholder: 'Enter name',
      defaultValue: currentUser?.nickname ?? '',
      onSubmit: async (nickname) => {
        const user = await updateCurrentUserInfo(nickname);
        await authManager.authenticate({ userId: user.userId, nickname: user.nickname });
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
            const photo = await fileService.openCamera({
              mediaType: 'photo',
              onOpenFailure: (error) => {
                if (error.code === SBUError.CODE.ERR_PERMISSIONS_DENIED) {
                  alert({
                    title: STRINGS.DIALOG.ALERT_PERMISSIONS_TITLE,
                    message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(STRINGS.LABELS.PERMISSION_CAMERA, 'UIKitSample'),
                    buttons: [{ text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK, onPress: () => SBUUtils.openSettings() }],
                  });
                } else {
                  toast.show(STRINGS.TOAST.OPEN_CAMERA_ERROR, 'error');
                }
              },
            });

            if (!photo) return;

            await updateCurrentUserInfo(sdk.currentUser.nickname, photo);
          },
        },
        {
          title: 'Choose photo',
          onPress: async () => {
            const files = await fileService.openMediaLibrary({
              selectionLimit: 1,
              mediaType: 'photo',
              onOpenFailure: (error) => {
                if (error.code === SBUError.CODE.ERR_PERMISSIONS_DENIED) {
                  alert({
                    title: STRINGS.DIALOG.ALERT_PERMISSIONS_TITLE,
                    message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
                      STRINGS.LABELS.PERMISSION_DEVICE_STORAGE,
                      'UIKitSample',
                    ),
                    buttons: [{ text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK, onPress: () => SBUUtils.openSettings() }],
                  });
                } else {
                  toast.show(STRINGS.TOAST.OPEN_PHOTO_LIBRARY_ERROR, 'error');
                }
              },
            });
            if (!files || !files[0]) return;

            await updateCurrentUserInfo(sdk.currentUser.nickname, files[0]);
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

  if (!currentUser) return null;

  return (
    <View style={styles.container}>
      <Header
        title={'My settings'}
        right={<Header.Button color={colors.primary}>{'Edit'}</Header.Button>}
        onPressRight={onEdit}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{
          paddingLeft: left + styles.viewContainer.paddingHorizontal,
          paddingRight: right + styles.viewContainer.paddingHorizontal,
        }}
      >
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
