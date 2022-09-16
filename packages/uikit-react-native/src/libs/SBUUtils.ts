import { Linking, Platform } from 'react-native';

export default class SBUUtils {
  static openSettings() {
    Linking.openSettings().catch(() => {
      if (Platform.OS === 'ios') Linking.openURL('App-Prefs:root');
    });
  }
}
