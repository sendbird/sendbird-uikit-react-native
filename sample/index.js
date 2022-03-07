import { AppRegistry } from 'react-native';

import { Logger } from '@sendbird/uikit-utils';

import { name as appName } from './app.json';
import App from './src/App';
import { withReload } from './src/ReloadHelper';
import { withAppearance } from './src/hooks/useAppearance';

// Sendbird.setLogLevel(Sendbird.LogLevel.DEBUG);
Logger.setLogLevel('debug');

AppRegistry.registerComponent(appName, () => withReload(withAppearance(App)));
