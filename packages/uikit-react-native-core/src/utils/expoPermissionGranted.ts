import type { NotificationPermissionsStatus } from 'expo-notifications';

export interface ExpoPermissionResponse {
  canAskAgain: boolean;
  granted: boolean;
  status: 'denied' | 'granted' | 'undetermined';
}

export interface ExpoMediaLibraryPermissionResponse extends ExpoPermissionResponse {
  accessPrivileges?: 'all' | 'limited' | 'none';
}
export interface ExpoPushPermissionResponse extends ExpoPermissionResponse, NotificationPermissionsStatus {}

const expoPermissionGranted = (
  stats: Array<ExpoMediaLibraryPermissionResponse | ExpoPushPermissionResponse | ExpoPermissionResponse>,
  limitedCallback?: () => void,
) => {
  return stats.every((res) => {
    if ('accessPrivileges' in res) {
      if (res.accessPrivileges === 'limited') limitedCallback?.();
      return (
        res.granted || res.status === 'granted' || res.accessPrivileges === 'all' || res.accessPrivileges === 'limited'
      );
    }
    if ('ios' in res) {
      // NOT_DETERMINED = 0,
      // DENIED = 1,
      // AUTHORIZED = 2,
      // PROVISIONAL = 3,
      // EPHEMERAL = 4,
      return (
        res.granted || res.status === 'granted' || (res.ios?.status && (res.ios.status === 2 || res.ios.status === 3))
      );
    }
    return res.granted || res.status === 'granted';
  });
};

export default expoPermissionGranted;
