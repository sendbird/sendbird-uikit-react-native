import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLayoutEffect } from 'react';
import { Platform } from 'react-native';

interface SimpleCredential {
  userId: string;
}

interface CredentialStorageInterface {
  get(): Promise<SimpleCredential | null>;
  set(cred: SimpleCredential): Promise<void>;
  delete(): Promise<void>;
}

class CredentialStorage implements CredentialStorageInterface {
  private STORAGE_KEY = 'sendbird@credential';
  async get(): Promise<SimpleCredential | null> {
    const cred = await AsyncStorage.getItem(this.STORAGE_KEY);
    return cred ? JSON.parse(cred) : null;
  }
  async set(cred: SimpleCredential): Promise<void> {
    return AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(cred));
  }
  delete(): Promise<void> {
    return AsyncStorage.removeItem(this.STORAGE_KEY);
  }
}

const createAuthManager = (credStorage: CredentialStorageInterface) => {
  const internal: { cred: SimpleCredential | null } = {
    cred: __DEV__
      ? { userId: Platform.select({ android: 'TEST_ANDROID_UIKIT_RN', ios: 'TEST_IOS_UIKIT_RN', default: 'TESTER' }) }
      : null,
  };
  return {
    hasAuthentication() {
      return Boolean(internal.cred);
    },
    async getAuthentication() {
      if (internal.cred) return internal.cred;

      const cred = await credStorage.get();
      if (cred) internal.cred = cred;

      return internal.cred;
    },
    authenticate(cred: SimpleCredential) {
      internal.cred = cred;
      return credStorage.set(cred);
    },
    deAuthenticate() {
      internal.cred = null;
      return credStorage.delete();
    },
  };
};

export const authManager = createAuthManager(new CredentialStorage());
export const useAppAuth = (onAutonomousSignIn?: (cred: SimpleCredential) => void) => {
  useLayoutEffect(() => {
    authManager.getAuthentication().then((response) => {
      if (response) onAutonomousSignIn?.(response);
    });
  }, []);

  return {
    signIn: (cred: SimpleCredential) => authManager.authenticate(cred),
    signOut: () => authManager.deAuthenticate(),
  };
};
