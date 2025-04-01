import { Platform } from 'react-native';

function shouldUseScrollViewEnhancer() {
  if (Platform.constants.reactNativeVersion?.major < 1) {
    if (Platform.constants.reactNativeVersion?.minor < 72) {
      return true;
    }
  }
  return false;
}

let FlatListInternal;
if (shouldUseScrollViewEnhancer()) {
  try {
    FlatListInternal = require('@sendbird/react-native-scrollview-enhancer').FlatList;
  } catch {
    FlatListInternal = require('react-native').FlatList;
  }
} else {
  FlatListInternal = require('react-native').FlatList;
}

export default FlatListInternal;
