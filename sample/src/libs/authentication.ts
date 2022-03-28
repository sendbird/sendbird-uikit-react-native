import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLayoutEffect } from 'react';

import { USER_ID } from '../env';

interface SimpleUser {
  userId: string;
}

interface UserStorageInterface {
  get(): Promise<SimpleUser | null>;
  set(user: SimpleUser): Promise<void>;
  delete(): Promise<void>;
}

class UserStorage implements UserStorageInterface {
  private STORAGE_KEY = 'sendbird@auth';
  async get(): Promise<SimpleUser | null> {
    const user = await AsyncStorage.getItem(this.STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  }
  async set(user: SimpleUser): Promise<void> {
    return AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }
  delete(): Promise<void> {
    return AsyncStorage.removeItem(this.STORAGE_KEY);
  }
}

const createAuthManager = (userStorage: UserStorageInterface) => {
  const internal: { user: SimpleUser | null } = {
    user: __DEV__ ? { userId: USER_ID } : null,
  };
  return {
    hasAuthentication() {
      return Boolean(internal.user);
    },
    async getAuthentication() {
      if (internal.user) return internal.user;

      const user = await userStorage.get();
      if (user) internal.user = user;

      return internal.user;
    },
    authenticate(user: SimpleUser) {
      internal.user = user;
      return userStorage.set(user);
    },
    deAuthenticate() {
      internal.user = null;
      return userStorage.delete();
    },
  };
};

export const authManager = createAuthManager(new UserStorage());
export const useAppAuth = (onAutonomousSignIn?: (user: SimpleUser) => void) => {
  useLayoutEffect(() => {
    authManager.getAuthentication().then((response) => {
      if (response) onAutonomousSignIn?.(response);
    });
  }, []);

  return {
    signIn: (user: SimpleUser) => authManager.authenticate(user),
    signOut: () => authManager.deAuthenticate(),
  };
};
