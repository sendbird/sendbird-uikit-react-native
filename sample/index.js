import React from 'react';
import { AppRegistry, I18nManager, LogBox } from 'react-native';
import { withTouchReload } from 'react-native-touch-reload';

import { Logger } from '@sendbird/uikit-utils';

import { name as appName } from './app.json';
import AppRoot from './src/App';
import { withUIKitLocalConfigs } from './src/context/uikitLocalConfigs';
import { withAppearance } from './src/hooks/useAppearance';
import './src/libs/notification';

Logger.setLogLevel('warn');
LogBox.ignoreLogs(['UIKit Warning', 'FileViewer > params.deleteMessage (Function)']);
I18nManager.allowRTL(true);

const App = withTouchReload(withAppearance(withUIKitLocalConfigs(AppRoot)));
function HeadlessCheck({ isHeadless }) {
  if (isHeadless) return null;
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
