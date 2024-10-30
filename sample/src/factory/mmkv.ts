import { MMKV } from 'react-native-mmkv';

export const mmkv = new MMKV();

export const uikitLocalConfigStorage = new MMKV({ id: 'uikit.local.config' });
