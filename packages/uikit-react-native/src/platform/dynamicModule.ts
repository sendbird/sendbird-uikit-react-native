/* eslint-disable no-console */
import { NativeModules } from 'react-native';

import { Logger } from '@sendbird/uikit-utils';

export type SBUNativeModule =
  | 'react-native-file-access'
  | 'react-native-fast-image'
  | '@react-native-community/netinfo';

interface SBUDynamicModuleInfo {
  packageName: SBUNativeModule;
  moduleName: string;
  getPackage: <T>(logLevel: 'error' | 'warn' | 'none') => T;
  url: string;
}

function checkLink(dmi: SBUDynamicModuleInfo, logLevel: 'error' | 'warn' | 'none') {
  const nativeModule = NativeModules[dmi.moduleName];
  if (!nativeModule) {
    const message = `[UIKit] Cannot use native module, you should install and link ${dmi.packageName} (${dmi.url})`;
    if (logLevel === 'error') console.error(message);
    if (logLevel === 'warn') console.warn(message);
  }
}

const SBUDynamicModuleRegistry: Record<SBUNativeModule, SBUDynamicModuleInfo> = {
  'react-native-file-access': {
    packageName: 'react-native-file-access',
    moduleName: 'RNFileAccess',
    url: 'https://github.com/alpha0010/react-native-file-access',
    getPackage(logLevel) {
      checkLink(this, logLevel);

      try {
        return require('react-native-file-access');
      } catch (e) {
        return null;
      }
    },
  },
  'react-native-fast-image': {
    packageName: 'react-native-fast-image',
    moduleName: 'FastImageView',
    url: 'https://github.com/DylanVann/react-native-fast-image',
    getPackage(logLevel) {
      checkLink(this, logLevel);

      try {
        return require('react-native-fast-image');
      } catch (e) {
        return null;
      }
    },
  },
  '@react-native-community/netinfo': {
    packageName: '@react-native-community/netinfo',
    moduleName: 'RNCNetInfo',
    url: 'https://github.com/react-native-netinfo/react-native-netinfo',
    getPackage(logLevel) {
      checkLink(this, logLevel);

      try {
        return require('@react-native-community/netinfo');
      } catch (e) {
        return null;
      }
    },
  },
};

const SBUDynamicModule = {
  getInfo(name: SBUNativeModule) {
    return SBUDynamicModuleRegistry[name] ?? null;
  },
  get<T>(name: SBUNativeModule, logLevel: 'error' | 'warn' | 'none' = 'error') {
    const dmi = this.getInfo(name);
    if (!dmi) Logger.warn(`${name} doesn't exist in the dynamic module`);
    return dmi?.getPackage<T>(logLevel);
  },
};

export default SBUDynamicModule;
