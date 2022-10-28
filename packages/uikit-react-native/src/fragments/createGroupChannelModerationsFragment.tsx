import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { NOOP } from '@sendbird/uikit-utils';

import { createGroupChannelModerationsModule } from '../domain/groupChannelModerations';
import type {
  GroupChannelModerationsFragment,
  GroupChannelModerationsModule,
} from '../domain/groupChannelModerations/types';

const createGroupChannelModerationsFragment = (
  initModule?: Partial<GroupChannelModerationsModule>,
): GroupChannelModerationsFragment => {
  const GroupChannelModerationsModule = createGroupChannelModerationsModule(initModule);

  return ({
    channel,
    onPressHeaderLeft = NOOP,
    onPressMenuBannedUsers,
    onPressMenuMutedMembers,
    onPressMenuOperators,
    menuItemsCreator,
  }) => {
    const { left, right } = useSafeAreaInsets();
    const { colors } = useUIKitTheme();
    return (
      <GroupChannelModerationsModule.Provider channel={channel}>
        <GroupChannelModerationsModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={{
            paddingLeft: left + styles.viewContainer.paddingHorizontal,
            paddingRight: right + styles.viewContainer.paddingHorizontal,
          }}
        >
          <GroupChannelModerationsModule.Menu
            onPressMenuBannedUsers={onPressMenuBannedUsers}
            onPressMenuMutedMembers={onPressMenuMutedMembers}
            onPressMenuOperators={onPressMenuOperators}
            menuItemsCreator={menuItemsCreator}
          />
        </ScrollView>
      </GroupChannelModerationsModule.Provider>
    );
  };
};

const styles = createStyleSheet({
  viewContainer: {
    paddingHorizontal: 16,
  },
});

export default createGroupChannelModerationsFragment;
