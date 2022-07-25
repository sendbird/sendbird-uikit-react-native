/* eslint-disable no-console */
import type RNNetInfo from '@react-native-community/netinfo';
import { NativeModules } from 'react-native';
import type RNFastImage from 'react-native-fast-image';
import type RNFileAccess from 'react-native-file-access';

import { Logger } from '@sendbird/uikit-utils';

export interface DynamicModules {
  'react-native-file-access': typeof RNFileAccess;
  'react-native-fast-image': typeof RNFastImage;
  '@react-native-community/netinfo': typeof RNNetInfo;
}
export type SBUNativeModule = keyof DynamicModules;

interface SBUDynamicModuleInfo {
  packageName: SBUNativeModule;
  minVersion: string;
  moduleName: string;
  getPackage: <T>(logLevel: 'error' | 'warn' | 'none') => T;
  url: string;
}

export function checkVersion(minVersion: string, currentVersion: string) {
  const [minMajor, minMinor, minPatch] = minVersion.split('.');
  const [currMajor, currMinor, currPatch] = currentVersion.split('.');

  if (minMajor < currMajor) return true;
  if (minMajor === currMajor) {
    if (minMinor < currMinor) return true;
    if (minMinor === currMinor) {
      return minPatch <= currPatch;
    }
    return false;
  }
  return false;
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
    minVersion: '2.4.3',
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
    minVersion: '8.5.11',
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
    minVersion: '9.3.0',
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
  register(mdi: SBUDynamicModuleInfo) {
    SBUDynamicModuleRegistry[mdi.moduleName as SBUNativeModule] = mdi;
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
