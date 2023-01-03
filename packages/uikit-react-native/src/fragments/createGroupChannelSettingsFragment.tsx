import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { NOOP } from '@sendbird/uikit-utils';

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
    onPressMenuLeaveChannel,
    onPressMenuNotification,
    menuItemsCreator,
  }) => {
    const { colors } = useUIKitTheme();
    const { left, right } = useSafeAreaInsets();

    return (
      <GroupChannelSettingsModule.Provider channel={channel}>
        <GroupChannelSettingsModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={{
            paddingLeft: left + styles.viewContainer.paddingHorizontal,
            paddingRight: right + styles.viewContainer.paddingHorizontal,
          }}
        >
          <GroupChannelSettingsModule.Info />
          <GroupChannelSettingsModule.Menu
            menuItemsCreator={menuItemsCreator}
            onPressMenuModeration={onPressMenuModeration}
            onPressMenuMembers={onPressMenuMembers}
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
