import React, { createContext, useCallback } from 'react';

import { useActiveGroupChannel, useChannelHandler } from '@sendbird/uikit-chat-hooks';
import { useActionMenu, useBottomSheet, usePrompt, useToast } from '@sendbird/uikit-react-native-foundation';
import {
  NOOP,
  SendbirdGroupChannel,
  SendbirdGroupChannelParams,
  SendbirdOpenChannel,
  isDifferentChannel,
  useForceUpdate,
  useUniqId,
} from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization, usePlatformService, useSendbirdChat } from '../../../hooks/useContext';
import type { GroupChannelSettingsContextsType, GroupChannelSettingsProps } from '../types';

export const GroupChannelSettingsContexts: GroupChannelSettingsContextsType = {
  Fragment: createContext({
    channel: {} as SendbirdGroupChannel,
    headerTitle: '',
    headerRight: '',
    onPressHeaderRight: NOOP,
  }),
};

const HOOK_NAME = 'GroupChannelSettingsContextsProvider';
export const GroupChannelSettingsContextsProvider: React.FC<GroupChannelSettingsProps['Provider']> = ({
  children,
  channel,
}) => {
  const uniqId = useUniqId(HOOK_NAME);
  const forceUpdate = useForceUpdate();
  const { STRINGS } = useLocalization();
  const { sdk } = useSendbirdChat();
  const { fileService } = usePlatformService();

  const { activeChannel, setActiveChannel } = useActiveGroupChannel(sdk, channel);

  const onChannelChanged = (channel: SendbirdGroupChannel | SendbirdOpenChannel) => {
    if (isDifferentChannel(channel, activeChannel) || !channel.isGroupChannel()) return;
    setActiveChannel(channel);
    forceUpdate();
  };

  useChannelHandler(
    sdk,
    `${HOOK_NAME}_${uniqId}`,
    {
      onChannelChanged: onChannelChanged,
      onChannelFrozen: onChannelChanged,
      onChannelUnfrozen: onChannelChanged,
    },
    [activeChannel],
  );

  const toast = useToast();
  const { openSheet } = useBottomSheet();
  const { prompt } = usePrompt();
  const { openMenu } = useActionMenu();

  const updateChannel = useCallback(
    async (params: SendbirdGroupChannelParams) => {
      const updatedChannel = await activeChannel.updateChannel(params);
      setActiveChannel(updatedChannel);
      forceUpdate();
    },
    [activeChannel],
  );

  const changeChannelName = useCallback(() => {
    prompt({
      title: STRINGS.GROUP_CHANNEL_SETTINGS.DIALOG_CHANGE_NAME_PROMPT_TITLE,
      submitLabel: STRINGS.GROUP_CHANNEL_SETTINGS.DIALOG_CHANGE_NAME_PROMPT_OK,
      placeholder: STRINGS.GROUP_CHANNEL_SETTINGS.DIALOG_CHANGE_NAME_PROMPT_PLACEHOLDER,
      defaultValue: activeChannel.name,
      onSubmit: async (channelName) => {
        const params = new sdk.GroupChannelParams();
        params.name = channelName;
        await updateChannel(params);
      },
    });
  }, [STRINGS, updateChannel, activeChannel.name]);

  const changeChannelImage = useCallback(() => {
    openMenu({
      title: STRINGS.GROUP_CHANNEL_SETTINGS.DIALOG_CHANGE_IMAGE_MENU_TITLE,
      menuItems: [
        {
          title: STRINGS.GROUP_CHANNEL_SETTINGS.DIALOG_CHANGE_IMAGE_MENU_CAMERA,
          onPress: async () => {
            const file = await fileService.openCamera({
              mediaType: 'photo',
              onOpenFailureWithToastMessage: () => toast.show(STRINGS.TOAST.OPEN_CAMERA_ERROR, 'error'),
            });
            if (!file) return;

            const params = new sdk.GroupChannelParams();
            params.coverImage = file;
            await updateChannel(params);
          },
        },
        {
          title: STRINGS.GROUP_CHANNEL_SETTINGS.DIALOG_CHANGE_IMAGE_MENU_PHOTO_LIBRARY,
          onPress: async () => {
            const files = await fileService.openMediaLibrary({
              selectionLimit: 1,
              mediaType: 'photo',
              onOpenFailureWithToastMessage: () => toast.show(STRINGS.TOAST.OPEN_PHOTO_LIBRARY_ERROR, 'error'),
            });
            if (!files || !files[0]) return;

            const params = new sdk.GroupChannelParams();
            params.coverImage = files[0];
            await updateChannel(params);
          },
        },
      ],
    });
  }, [STRINGS, updateChannel]);

  const onPressHeaderRight = useCallback(() => {
    openSheet({
      sheetItems: [
        { title: STRINGS.GROUP_CHANNEL_SETTINGS.DIALOG_CHANGE_NAME, onPress: changeChannelName },
        { title: STRINGS.GROUP_CHANNEL_SETTINGS.DIALOG_CHANGE_IMAGE, onPress: changeChannelImage },
      ],
    });
  }, [STRINGS, changeChannelImage, changeChannelName]);

  return (
    <ProviderLayout>
      <GroupChannelSettingsContexts.Fragment.Provider
        value={{
          channel: activeChannel,
          headerTitle: STRINGS.GROUP_CHANNEL_SETTINGS.HEADER_TITLE,
          headerRight: STRINGS.GROUP_CHANNEL_SETTINGS.HEADER_RIGHT,
          onPressHeaderRight,
        }}
      >
        {children}
      </GroupChannelSettingsContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
