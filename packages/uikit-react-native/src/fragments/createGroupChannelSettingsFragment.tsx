import React from 'react';
import { ScrollView } from 'react-native';

import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { NOOP, useSafeAreaPadding } from '@sendbird/uikit-utils';

import createGroupChannelSettingsModule from '../domain/groupChannelSettings/module/createGroupChannelSettingsModule';
import type { GroupChannelSettingsFragment, GroupChannelSettingsModule } from '../domain/groupChannelSettings/types';

const createGroupChannelSettingsFragment = (
  initModule?: Partial<GroupChannelSettingsModule>,
): GroupChannelSettingsFragment => {
  const GroupChannelSettingsModule = createGroupChannelSettingsModule(initModule);

  return ({
    onPressHeaderLeft = NOOP,
    channel,
    onPressMenuModeration,
    onPressMenuMembers,
    onPressMenuSearchInChannel,
    onPressMenuLeaveChannel,
    onPressMenuNotification,
    menuItemsCreator,
  }) => {
    const { colors } = useUIKitTheme();
    const safeArea = useSafeAreaPadding(['left', 'right']);

    return (
      <GroupChannelSettingsModule.Provider channel={channel}>
        <GroupChannelSettingsModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={{
            paddingStart: safeArea.paddingStart + styles.viewContainer.paddingHorizontal,
            paddingEnd: safeArea.paddingEnd + styles.viewContainer.paddingHorizontal,
          }}
        >
          <GroupChannelSettingsModule.Info />
          <GroupChannelSettingsModule.Menu
            menuItemsCreator={menuItemsCreator}
            onPressMenuModeration={onPressMenuModeration}
            onPressMenuMembers={onPressMenuMembers}
            onPressMenuSearchInChannel={onPressMenuSearchInChannel}
            onPressMenuLeaveChannel={onPressMenuLeaveChannel}
            onPressMenuNotification={onPressMenuNotification}
          />
        </ScrollView>
      </GroupChannelSettingsModule.Provider>
    );
  };
};

const styles = createStyleSheet({
  viewContainer: {
    paddingHorizontal: 16,
  },
});

export default createGroupChannelSettingsFragment;
