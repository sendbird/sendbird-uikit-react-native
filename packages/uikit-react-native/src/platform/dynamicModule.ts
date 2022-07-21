import { NativeModules } from 'react-native';

import { Logger } from '@sendbird/uikit-utils';

export type SBUNativeModule = 'react-native-file-access' | 'react-native-fast-image';

interface SBUDynamicModuleInfo {
  packageName: SBUNativeModule;
  moduleName: string;
  getPackage: <T>() => T;
  url: string;
}

function checkLink(dmi: SBUDynamicModuleInfo) {
  const nativeModule = NativeModules[dmi.moduleName];
  if (!nativeModule) {
    throw new Error(`[UIKit] Cannot use native module, you should install and link ${dmi.packageName} (${dmi.url})`);
  }
}

const SBUDynamicModuleRegistry: Record<SBUNativeModule, SBUDynamicModuleInfo> = {
  'react-native-file-access': {
    packageName: 'react-native-file-access',
    moduleName: 'RNFileAccess',
    url: 'https://github.com/alpha0010/react-native-file-access',
    getPackage() {
      checkLink(this);

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
    getPackage() {
      checkLink(this);

      try {
        return require('react-native-fast-image');
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
  get<T>(name: SBUNativeModule) {
    const dmi = this.getInfo(name);
    if (!dmi) Logger.warn(`${name} doesn't exist in the dynamic module`);
    return dmi?.getPackage<T>();
  },
};

export default SBUDynamicModule;
