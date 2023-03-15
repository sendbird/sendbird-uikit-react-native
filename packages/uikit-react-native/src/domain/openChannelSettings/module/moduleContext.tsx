import React, { createContext, useCallback } from 'react';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import { useActionMenu, useAlert, useBottomSheet, usePrompt, useToast } from '@sendbird/uikit-react-native-foundation';
import {
  NOOP,
  SendbirdBaseChannel,
  SendbirdOpenChannel,
  SendbirdOpenChannelUpdateParams,
  isDifferentChannel,
  useForceUpdate,
  useUniqHandlerId,
} from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization, usePlatformService, useSendbirdChat } from '../../../hooks/useContext';
import SBUError from '../../../libs/SBUError';
import SBUUtils from '../../../libs/SBUUtils';
import type { OpenChannelSettingsContextsType, OpenChannelSettingsModule } from '../types';

export const OpenChannelSettingsContexts: OpenChannelSettingsContextsType = {
  Fragment: createContext({
    channel: {} as SendbirdOpenChannel,
    headerTitle: '',
    headerRight: '',
    onPressHeaderRight: NOOP,
  }),
};

export const OpenChannelSettingsContextsProvider: OpenChannelSettingsModule['Provider'] = ({
  channel,
  onNavigateToOpenChannel,
  children,
}) => {
  const handlerId = useUniqHandlerId('OpenChannelSettingsContextsProvider');
  const forceUpdate = useForceUpdate();
  const { STRINGS } = useLocalization();
  const { sdk, currentUser } = useSendbirdChat();
  const { fileService } = usePlatformService();
  const { alert } = useAlert();

  const onChannelChanged = (eventChannel: SendbirdBaseChannel) => {
    if (isDifferentChannel(eventChannel, channel)) return;
    forceUpdate();
  };
  const onOperatorUpdated = (eventChannel: SendbirdBaseChannel) => {
    if (isDifferentChannel(eventChannel, channel) || !eventChannel.isOpenChannel()) return;
    if (currentUser && !eventChannel.isOperator(currentUser.userId)) {
      onNavigateToOpenChannel();
    }
  };

  useChannelHandler(
    sdk,
    handlerId,
    {
      onOperatorUpdated: onOperatorUpdated,
      onChannelUnfrozen: onChannelChanged,
      onChannelChanged: onChannelChanged,
      onChannelFrozen: onChannelChanged,
      onUserBanned: onChannelChanged,
    },
    'open',
  );

  const toast = useToast();
  const { openSheet } = useBottomSheet();
  const { openPrompt } = usePrompt();
  const { openMenu } = useActionMenu();

  const updateChannel = useCallback(
    async (params: SendbirdOpenChannelUpdateParams) => {
      await channel.updateChannel(params);
      forceUpdate();
    },
    [channel],
  );

  const changeChannelName = useCallback(() => {
    openPrompt({
      title: STRINGS.OPEN_CHANNEL_SETTINGS.DIALOG_CHANGE_NAME_PROMPT_TITLE,
      submitLabel: STRINGS.OPEN_CHANNEL_SETTINGS.DIALOG_CHANGE_NAME_PROMPT_OK,
      placeholder: STRINGS.OPEN_CHANNEL_SETTINGS.DIALOG_CHANGE_NAME_PROMPT_PLACEHOLDER,
      defaultValue: channel.name,
      onSubmit: (channelName) => updateChannel({ name: channelName }),
    });
  }, [STRINGS, updateChannel, channel.name]);

  const changeChannelImage = useCallback(() => {
    openMenu({
      title: STRINGS.OPEN_CHANNEL_SETTINGS.DIALOG_CHANGE_IMAGE_MENU_TITLE,
      menuItems: [
        {
          title: STRINGS.OPEN_CHANNEL_SETTINGS.DIALOG_CHANGE_IMAGE_MENU_CAMERA,
          onPress: async () => {
            const file = await fileService.openCamera({
              mediaType: 'photo',
              onOpenFailure: (error) => {
                if (error.code === SBUError.CODE.ERR_PERMISSIONS_DENIED) {
                  alert({
                    title: STRINGS.DIALOG.ALERT_PERMISSIONS_TITLE,
                    message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
                      STRINGS.LABELS.PERMISSION_CAMERA,
                      STRINGS.LABELS.PERMISSION_APP_NAME,
                    ),
                    buttons: [{ text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK, onPress: () => SBUUtils.openSettings() }],
                  });
                } else {
                  toast.show(STRINGS.TOAST.OPEN_CAMERA_ERROR, 'error');
                }
              },
            });
            if (!file) return;

            await updateChannel({ coverUrlOrImage: file });
          },
        },
        {
          title: STRINGS.OPEN_CHANNEL_SETTINGS.DIALOG_CHANGE_IMAGE_MENU_PHOTO_LIBRARY,
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
                      STRINGS.LABELS.PERMISSION_APP_NAME,
                    ),
                    buttons: [{ text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK, onPress: () => SBUUtils.openSettings() }],
                  });
                } else {
                  toast.show(STRINGS.TOAST.OPEN_PHOTO_LIBRARY_ERROR, 'error');
                }
              },
            });
            if (!files || !files[0]) return;

            await updateChannel({ coverUrlOrImage: files[0] });
          },
        },
      ],
    });
  }, [STRINGS, updateChannel]);

  const onPressHeaderRight = useCallback(() => {
    openSheet({
      sheetItems: [
        { title: STRINGS.OPEN_CHANNEL_SETTINGS.DIALOG_CHANGE_NAME, onPress: changeChannelName },
        { title: STRINGS.OPEN_CHANNEL_SETTINGS.DIALOG_CHANGE_IMAGE, onPress: changeChannelImage },
      ],
    });
  }, [STRINGS, changeChannelImage, changeChannelName]);

  return (
    <ProviderLayout>
      <OpenChannelSettingsContexts.Fragment.Provider
        value={{
          channel,
          headerTitle: STRINGS.OPEN_CHANNEL_SETTINGS.HEADER_TITLE,
          headerRight: STRINGS.OPEN_CHANNEL_SETTINGS.HEADER_RIGHT,
          onPressHeaderRight,
        }}
      >
        {children}
      </OpenChannelSettingsContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
