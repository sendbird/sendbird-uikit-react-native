import type * as Permissions from 'react-native-permissions';

const nativePermissionGranted = (stats: Record<Permissions.Permission, Permissions.PermissionStatus>) => {
  return Object.values(stats).every((result) => result === 'granted');
};

export default nativePermissionGranted;
