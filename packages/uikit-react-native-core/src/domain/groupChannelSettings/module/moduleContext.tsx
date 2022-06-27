import React, { createContext, useCallback, useEffect, useState } from 'react';
import type Sendbird from 'sendbird';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import { useActionMenu, useBottomSheet, usePrompt } from '@sendbird/uikit-react-native-foundation';
import { NOOP, isDifferentChannel, useForceUpdate, useUniqId } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../contexts/Localization';
import { usePlatformService } from '../../../contexts/PlatformService';
import { useSendbirdChat } from '../../../contexts/SendbirdChat';
import type { GroupChannelSettingsContextType, GroupChannelSettingsProps } from '../types';

export const GroupChannelSettingsContext: GroupChannelSettingsContextType = {
  Fragment: createContext({
    channel: {} as Sendbird.GroupChannel,
    headerTitle: '',
    headerRight: '',
    onPressHeaderRight: NOOP,
  }),
};

const HOOK_NAME = 'GroupChannelSettingsContextProvider';
export const GroupChannelSettingsContextProvider: React.FC<GroupChannelSettingsProps['Provider']> = ({
  children,
  staleChannel,
}) => {
  const uniqId = useUniqId(HOOK_NAME);
  const forceUpdate = useForceUpdate();
  const [activeChannel, setActiveChannel] = useState(staleChannel);
  const { STRINGS } = useLocalization();
  const { sdk } = useSendbirdChat();
  const { fileService } = usePlatformService();

  useEffect(() => {
    setActiveChannel(staleChannel);
  }, [staleChannel.url]);

  const onChannelChanged = (channel: Sendbird.GroupChannel | Sendbird.OpenChannel) => {
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

  const { openSheet } = useBottomSheet();
  const { prompt } = usePrompt();
  const { openMenu } = useActionMenu();

  const updateChannel = useCallback(
    async (params: Sendbird.GroupChannelParams) => {
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
            const file = await fileService.openCamera();
            if (!file) return;

            const params = new sdk.GroupChannelParams();
            params.coverImage = file;
            await updateChannel(params);
          },
        },
        {
          title: STRINGS.GROUP_CHANNEL_SETTINGS.DIALOG_CHANGE_IMAGE_MENU_PHOTO_LIBRARY,
          onPress: async () => {
            const files = await fileService.openMediaLibrary({ selectionLimit: 1 });
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
      <GroupChannelSettingsContext.Fragment.Provider
        value={{
          channel: activeChannel,
          headerTitle: STRINGS.GROUP_CHANNEL_SETTINGS.HEADER_TITLE,
          headerRight: STRINGS.GROUP_CHANNEL_SETTINGS.HEADER_RIGHT,
          onPressHeaderRight,
        }}
      >
        {children}
      </GroupChannelSettingsContext.Fragment.Provider>
    </ProviderLayout>
  );
};
