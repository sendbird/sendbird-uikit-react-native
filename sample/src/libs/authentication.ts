import { useState } from 'react';

import { useAsyncLayoutEffect } from '@sendbird/uikit-utils';

import { mmkv } from '../factory/mmkv';

interface SimpleCredential {
  userId: string;
  nickname?: string;
}

interface CredentialStorageInterface {
  get(): Promise<SimpleCredential | null>;
  set(cred: SimpleCredential): Promise<void>;
  delete(): Promise<void>;
}

class CredentialStorage implements CredentialStorageInterface {
  private STORAGE_KEY = 'sendbird@credential';
  async get(): Promise<SimpleCredential | null> {
    const cred = mmkv.getString(this.STORAGE_KEY);
    return cred ? JSON.parse(cred) : null;
  }
  async set(cred: SimpleCredential): Promise<void> {
    return mmkv.set(this.STORAGE_KEY, JSON.stringify(cred));
  }
  async delete(): Promise<void> {
    return mmkv.delete(this.STORAGE_KEY);
  }
}

const createAuthManager = (credStorage: CredentialStorageInterface) => {
  const internal: { cred: SimpleCredential | null } = { cred: null };
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
export const useAppAuth = (onAutonomousSignIn?: (cred: SimpleCredential) => Promise<void>) => {
  const [loading, setLoading] = useState(true);

  useAsyncLayoutEffect(async () => {
    await authManager
      .getAuthentication()
      .then(async (response) => {
        if (response) onAutonomousSignIn?.(response);
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    authManager,
    loading,
    signIn: (cred: SimpleCredential) => authManager.authenticate(cred),
    signOut: () => authManager.deAuthenticate(),
  };
};
