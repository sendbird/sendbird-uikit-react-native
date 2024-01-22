// @ts-nocheck
import { UserOnlineState } from '@sendbird/chat';
import type { Sender } from '@sendbird/chat/message';
import type {
  SendbirdAdminMessage,
  SendbirdMember,
  SendbirdParticipant,
  SendbirdUser,
  SendbirdUserMessage,
} from '@sendbird/uikit-utils';

import type { GetMockParams } from '../types';
import { createTestContext } from '../utils/createTestContext';

const tc = createTestContext();

type Params = GetMockParams<Sender & SendbirdUserMessage & SendbirdParticipant & SendbirdMember>;

export const createMockUser = (params: Params) => {
  return new MockUser(params);
};

class MockUser implements SendbirdUser {
  constructor(public params: Params) {
    tc.increaseIncrement();
    Object.assign(this, params);
  }

  userId: string = 'user_id_' + tc.getHash();
  requireAuth = true;
  nickname = 'nickname_' + tc.getHash();
  plainProfileUrl = 'profile_url_' + tc.getHash();
  metaData: object = {};
  connectionStatus: UserOnlineState = UserOnlineState.OFFLINE;
  isActive = false;
  lastSeenAt = tc.date + tc.increment;
  preferredLanguages: string[] = [];
  friendDiscoveryKey = tc.getHash();
  friendName = 'friend_name_' + tc.getHash();

  get profileUrl(): string {
    throw new Error('Method not implemented.');
  }
  serialize(): object {
    throw new Error('Method not implemented.');
  }
  createMetaData(): Promise<object> {
    throw new Error('Method not implemented.');
  }
  updateMetaData(): Promise<object> {
    throw new Error('Method not implemented.');
  }
  deleteMetaData(): Promise<object> {
    throw new Error('Method not implemented.');
  }
  deleteAllMetaData(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  asParticipant(): SendbirdParticipant {
    return this as unknown as SendbirdParticipant;
  }
  asMember(): SendbirdMember {
    return this as unknown as SendbirdMember;
  }
  asAdminMessage(): SendbirdAdminMessage {
    return this as unknown as SendbirdAdminMessage;
  }
  asSender(): Sender {
    return this as unknown as Sender;
  }
}
