import type { Permission, PermissionStatus } from 'react-native-permissions';

const nativePermissionGranted = (stats: Record<Permission, PermissionStatus>) => {
  return Object.values(stats).every((result) => result === 'granted');
};

export default nativePermissionGranted;
