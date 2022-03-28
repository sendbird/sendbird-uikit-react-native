import React from 'react';
import { AppRegistry, LogBox } from 'react-native';

import { Logger } from '@sendbird/uikit-utils';

import { name as appName } from './app.json';
import AppRoot from './src/App';
import { withAppearance } from './src/hooks/useAppearance';
import { withReload } from './src/libs/ReloadHelper';
import './src/libs/notification';

// Sendbird.setLogLevel(Sendbird.LogLevel.DEBUG);
Logger.setLogLevel('warn');
LogBox.ignoreLogs(['UIKit Warning', "Warning: Can't perform"]);

const App = withReload(withAppearance(AppRoot));
function HeadlessCheck({ isHeadless }) {
  if (isHeadless) return null;
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
