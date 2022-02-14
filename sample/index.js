import { AppRegistry } from 'react-native';

import { Logger } from '@sendbird/uikit-utils';

import { name as appName } from './app.json';
import App from './src/App';

// Sendbird.setLogLevel(Sendbird.LogLevel.DEBUG);
Logger.setLogLevel('debug');

AppRegistry.registerComponent(appName, () => App);
