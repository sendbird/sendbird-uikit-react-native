import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { NOOP } from '@sendbird/uikit-utils';

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
    const { left, right } = useSafeAreaInsets();
    const { colors } = useUIKitTheme();

    return (
      <OpenChannelModerationModule.Provider channel={channel}>
        <OpenChannelModerationModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={{
            paddingLeft: left + styles.viewContainer.paddingHorizontal,
            paddingRight: right + styles.viewContainer.paddingHorizontal,
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
