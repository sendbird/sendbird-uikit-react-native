/* eslint-disable no-console */
import type * as RNCNetInfo from '@react-native-community/netinfo';
import { NativeModules, UIManager } from 'react-native';

import { Logger } from '@sendbird/uikit-utils';

export type SBUNativeModule = keyof DynamicModules;

interface SBUDynamicModuleInfo {
  packageName: SBUNativeModule;
  nativeModuleNamespace: string;
  getPackage: <T>(logLevel: 'error' | 'warn' | 'none') => T;
  url: string;
  isComponent?: boolean;
}

function checkLink(dmi: SBUDynamicModuleInfo, logLevel: 'error' | 'warn' | 'none') {
  const nativeModule = (() => {
    if (dmi.isComponent) {
      return UIManager.getViewManagerConfig(dmi.nativeModuleNamespace);
    } else {
      return NativeModules[dmi.nativeModuleNamespace];
    }
  })();

  if (!nativeModule) {
    const message = `[UIKit] Cannot use native module, you should install and link ${dmi.packageName} (${dmi.url})`;
    if (logLevel === 'error') console.error(message);
    if (logLevel === 'warn') console.warn(message);
  }
}

export interface DynamicModules {
  '@react-native-community/netinfo': typeof RNCNetInfo;
}

const SBUDynamicModuleRegistry: Record<SBUNativeModule, SBUDynamicModuleInfo> = {
  '@react-native-community/netinfo': {
    packageName: '@react-native-community/netinfo',
    nativeModuleNamespace: 'RNCNetInfo',
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
  register(mdi: SBUDynamicModuleInfo) {
    SBUDynamicModuleRegistry[mdi.nativeModuleNamespace as SBUNativeModule] = mdi;
  },
  getInfo(name: SBUNativeModule) {
    return SBUDynamicModuleRegistry[name] ?? null;
  },
  get<K extends SBUNativeModule, T extends DynamicModules[K]>(name: K, logLevel: 'error' | 'warn' | 'none' = 'error') {
    const dmi = this.getInfo(name);
    if (!dmi) Logger.warn(`${name} doesn't exist in the dynamic module`);
    return dmi?.getPackage<T>(logLevel);
  },
};

export default SBUDynamicModule;
