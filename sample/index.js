import { AppRegistry, LogBox } from 'react-native';

import { Logger } from '@sendbird/uikit-utils';

import { name as appName } from './app.json';
import App from './src/App';
import { withReload } from './src/ReloadHelper';
import { withAppearance } from './src/hooks/useAppearance';

// Sendbird.setLogLevel(Sendbird.LogLevel.DEBUG);
Logger.setLogLevel('warn');
LogBox.ignoreLogs(['UIKit Warning', "Warning: Can't perform"]);

AppRegistry.registerComponent(appName, () => withReload(withAppearance(App)));
