import React from 'react';
import { ScrollView } from 'react-native';

import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { NOOP, useSafeAreaPadding } from '@sendbird/uikit-utils';

import { createOpenChannelModerationModule } from '../domain/openChannelModeration';
import type { OpenChannelModerationFragment, OpenChannelModerationModule } from '../domain/openChannelModeration/types';

const createOpenChannelModerationFragment = (
  initModule?: Partial<OpenChannelModerationModule>,
): OpenChannelModerationFragment => {
  const OpenChannelModerationModule = createOpenChannelModerationModule(initModule);

  return ({
    onPressHeaderLeft = NOOP,
    channel,
    onPressMenuMutedParticipants,
    onPressMenuOperators,
    menuItemsCreator,
    onPressMenuBannedUsers,
  }) => {
    const safeArea = useSafeAreaPadding(['left', 'right']);
    const { colors } = useUIKitTheme();

    return (
      <OpenChannelModerationModule.Provider channel={channel}>
        <OpenChannelModerationModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={{
            paddingStart: safeArea.paddingStart + styles.viewContainer.paddingHorizontal,
            paddingEnd: safeArea.paddingEnd + styles.viewContainer.paddingHorizontal,
          }}
        >
          <OpenChannelModerationModule.Menu
            onPressMenuOperators={onPressMenuOperators}
            onPressMenuMutedParticipants={onPressMenuMutedParticipants}
            onPressMenuBannedUsers={onPressMenuBannedUsers}
            menuItemsCreator={menuItemsCreator}
          />
        </ScrollView>
      </OpenChannelModerationModule.Provider>
    );
  };
};

const styles = createStyleSheet({
  viewContainer: {
    paddingHorizontal: 16,
  },
});

export default createOpenChannelModerationFragment;
