import React from 'react';
import { ScrollView } from 'react-native';

import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { NOOP, useSafeAreaPadding } from '@sendbird/uikit-utils';

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
    const safeArea = useSafeAreaPadding(['left', 'right']);
    const { colors } = useUIKitTheme();
    return (
      <GroupChannelModerationModule.Provider channel={channel}>
        <GroupChannelModerationModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={{
            paddingStart: safeArea.paddingStart + styles.viewContainer.paddingHorizontal,
            paddingEnd: safeArea.paddingEnd + styles.viewContainer.paddingHorizontal,
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
