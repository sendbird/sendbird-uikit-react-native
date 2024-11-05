import React from 'react';
import { ScrollView } from 'react-native';

import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { NOOP, useSafeAreaPadding } from '@sendbird/uikit-utils';

import { createOpenChannelSettingsModule } from '../domain/openChannelSettings';
import type { OpenChannelSettingsFragment, OpenChannelSettingsModule } from '../domain/openChannelSettings/types';

const createOpenChannelSettingsFragment = (
  initModule?: Partial<OpenChannelSettingsModule>,
): OpenChannelSettingsFragment => {
  const OpenChannelSettingsModule = createOpenChannelSettingsModule(initModule);

  return ({
    onPressHeaderLeft = NOOP,
    channel,
    onPressMenuModeration,
    onPressMenuParticipants,
    onPressMenuDeleteChannel,
    onNavigateToOpenChannel,
    menuItemsCreator,
  }) => {
    const { colors } = useUIKitTheme();
    const safeArea = useSafeAreaPadding(['left', 'right']);

    return (
      <OpenChannelSettingsModule.Provider channel={channel} onNavigateToOpenChannel={onNavigateToOpenChannel}>
        <OpenChannelSettingsModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={{
            paddingStart: safeArea.paddingStart + styles.viewContainer.paddingHorizontal,
            paddingEnd: safeArea.paddingEnd + styles.viewContainer.paddingHorizontal,
          }}
        >
          <OpenChannelSettingsModule.Info />
          <OpenChannelSettingsModule.Menu
            menuItemsCreator={menuItemsCreator}
            onPressMenuModeration={onPressMenuModeration}
            onPressMenuParticipants={onPressMenuParticipants}
            onPressMenuDeleteChannel={onPressMenuDeleteChannel}
          />
        </ScrollView>
      </OpenChannelSettingsModule.Provider>
    );
  };
};

const styles = createStyleSheet({
  viewContainer: {
    paddingHorizontal: 16,
  },
});

export default createOpenChannelSettingsFragment;
