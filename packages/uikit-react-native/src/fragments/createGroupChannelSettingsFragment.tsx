import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { GroupChannelSettingsFragment, GroupChannelSettingsModule } from '@sendbird/uikit-react-native-core';
import { createGroupChannelSettingsModule } from '@sendbird/uikit-react-native-core';
import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { NOOP } from '@sendbird/uikit-utils';

const createGroupChannelSettingsFragment = (
  initModule?: Partial<GroupChannelSettingsModule>,
): GroupChannelSettingsFragment => {
  const GroupChannelSettingsModule = createGroupChannelSettingsModule(initModule);

  return ({
    onPressHeaderLeft = NOOP,
    staleChannel,
    onPressMenuMembers,
    onLeaveChannel,
    menuItemsCreator,
    children,
  }) => {
    const { colors } = useUIKitTheme();
    const { left, right } = useSafeAreaInsets();

    return (
      <GroupChannelSettingsModule.Provider staleChannel={staleChannel}>
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
            onPressMenuMembers={onPressMenuMembers}
            onLeaveChannel={onLeaveChannel}
          />
          {children}
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
