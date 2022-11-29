import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { NOOP } from '@sendbird/uikit-utils';

import { createGroupChannelModerationModule } from '../domain/groupChannelModeration';
import type {
  GroupChannelModerationFragment,
  GroupChannelModerationModule,
} from '../domain/groupChannelModeration/types';

const createGroupChannelModerationFragment = (
  initModule?: Partial<GroupChannelModerationModule>,
): GroupChannelModerationFragment => {
  const GroupChannelModerationModule = createGroupChannelModerationModule(initModule);

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
      <GroupChannelModerationModule.Provider channel={channel}>
        <GroupChannelModerationModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={{
            paddingLeft: left + styles.viewContainer.paddingHorizontal,
            paddingRight: right + styles.viewContainer.paddingHorizontal,
          }}
        >
          <GroupChannelModerationModule.Menu
            onPressMenuBannedUsers={onPressMenuBannedUsers}
            onPressMenuMutedMembers={onPressMenuMutedMembers}
            onPressMenuOperators={onPressMenuOperators}
            menuItemsCreator={menuItemsCreator}
          />
        </ScrollView>
      </GroupChannelModerationModule.Provider>
    );
  };
};

const styles = createStyleSheet({
  viewContainer: {
    paddingHorizontal: 16,
  },
});

export default createGroupChannelModerationFragment;
