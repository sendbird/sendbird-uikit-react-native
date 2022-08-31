import React from 'react';
import { AppRegistry, LogBox } from 'react-native';
import { withTouchReload } from 'react-native-touch-reload';

import { Logger } from '@sendbird/uikit-utils';

import { name as appName } from './app.json';
import AppRoot from './src/App';
import { withAppearance } from './src/hooks/useAppearance';
import './src/libs/notification';

// Sendbird.setLogLevel(Sendbird.LogLevel.DEBUG);
Logger.setLogLevel('warn');
LogBox.ignoreLogs(['UIKit Warning', "Warning: Can't perform", 'FileViewer > params.deleteMessage (Function)']);

const App = withTouchReload(withAppearance(AppRoot));
function HeadlessCheck({ isHeadless }) {
  if (isHeadless) return null;
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
