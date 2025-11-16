import { createMMKV } from 'react-native-mmkv';

export const mmkv = createMMKV();

export const uikitLocalConfigStorage = createMMKV({ id: 'uikit.local.config' });
