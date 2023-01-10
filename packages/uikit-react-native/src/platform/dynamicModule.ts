/* eslint-disable no-console */
import type * as RNImageResizer from '@bam.tech/react-native-image-resizer';
import type * as RNNetInfo from '@react-native-community/netinfo';
import { NativeModules, UIManager } from 'react-native';
import type * as CreateThumbnail from 'react-native-create-thumbnail';
import type * as RNFileAccess from 'react-native-file-access';
import type * as Permissions from 'react-native-permissions';
import type * as Video from 'react-native-video';

import { Logger } from '@sendbird/uikit-utils';

export interface DynamicModules {
  '@react-native-community/netinfo': typeof RNNetInfo;
  '@bam.tech/react-native-image-resizer': typeof RNImageResizer;
  'react-native-create-thumbnail': typeof CreateThumbnail;
  'react-native-video': typeof Video;
  'react-native-permissions': typeof Permissions;
  'react-native-file-access': typeof RNFileAccess;
}

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
    if (dmi.isComponent) return UIManager.getViewManagerConfig(dmi.nativeModuleNamespace);
    else return NativeModules[dmi.nativeModuleNamespace];
  })();

  if (!nativeModule) {
    const message = `[UIKit] Cannot use native module, you should install and link ${dmi.packageName} (${dmi.url})`;
    if (logLevel === 'error') console.error(message);
    if (logLevel === 'warn') console.warn(message);
  }
}

const SBUDynamicModuleRegistry: Record<SBUNativeModule, SBUDynamicModuleInfo> = {
  'react-native-file-access': {
    packageName: 'react-native-file-access',
    nativeModuleNamespace: 'RNFileAccess',
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
  'react-native-permissions': {
    packageName: 'react-native-permissions',
    nativeModuleNamespace: 'RNPermissions',
    url: 'https://github.com/zoontek/react-native-permissions',
    getPackage(logLevel) {
      checkLink(this, logLevel);

      try {
        return require('react-native-permissions');
      } catch (e) {
        return null;
      }
    },
  },
  'react-native-video': {
    packageName: 'react-native-video',
    nativeModuleNamespace: 'RCTVideo',
    isComponent: true,
    url: 'https://github.com/react-native-video/react-native-video',
    getPackage(logLevel) {
      checkLink(this, logLevel);

      try {
        return require('react-native-video');
      } catch (e) {
        return null;
      }
    },
  },
  'react-native-create-thumbnail': {
    packageName: 'react-native-create-thumbnail',
    nativeModuleNamespace: 'CreateThumbnail',
    url: 'https://github.com/souvik-ghosh/react-native-create-thumbnail',
    getPackage(logLevel) {
      checkLink(this, logLevel);

      try {
        return require('react-native-create-thumbnail');
      } catch (e) {
        return null;
      }
    },
  },
  '@bam.tech/react-native-image-resizer': {
    packageName: '@bam.tech/react-native-image-resizer',
    nativeModuleNamespace: 'ImageResizer',
    url: 'https://github.com/bamlab/react-native-image-resizer',
    getPackage(logLevel) {
      checkLink(this, logLevel);

      try {
        return require('@bam.tech/react-native-image-resizer');
      } catch (e) {
        return null;
      }
    },
  },
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
