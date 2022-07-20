import type { Permission, PermissionStatus } from 'react-native-permissions';

const nativePermissionGranted = (stats: Record<Permission, PermissionStatus>, limitedCallback?: () => void) => {
  return Object.values(stats).every((result) => {
    if (result === 'granted') return true;
    if (result === 'limited') {
      limitedCallback?.();
      return true;
    }
    return false;
  });
};

export default nativePermissionGranted;
