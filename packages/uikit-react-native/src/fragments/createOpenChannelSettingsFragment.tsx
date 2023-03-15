import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { NOOP } from '@sendbird/uikit-utils';

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
    const { left, right } = useSafeAreaInsets();

    return (
      <OpenChannelSettingsModule.Provider channel={channel} onNavigateToOpenChannel={onNavigateToOpenChannel}>
        <OpenChannelSettingsModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={{
            paddingLeft: left + styles.viewContainer.paddingHorizontal,
            paddingRight: right + styles.viewContainer.paddingHorizontal,
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
