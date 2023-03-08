import { UserOnlineState } from '@sendbird/chat';
import type { Sender } from '@sendbird/chat/message';
import type {
  SendbirdAdminMessage,
  SendbirdMember,
  SendbirdParticipant,
  SendbirdUser,
  SendbirdUserMessage,
} from '@sendbird/uikit-utils';

import { createFixtureContext } from '../__fixtures__/createFixtureContext';
import type { MockSendbirdChatSDK } from './createMockSendbirdSDK';

type UserParams = { sdk?: MockSendbirdChatSDK } & Partial<Sender> &
  Partial<SendbirdUserMessage> &
  Partial<SendbirdParticipant> &
  Partial<SendbirdMember>;
export const createMockUser = (params: UserParams) => {
  return new MockUser(params);
};

const fixture = createFixtureContext();

class MockUser implements SendbirdUser {
  sdk?: MockSendbirdChatSDK;
  userId: string = 'user_id_' + fixture.getHash();
  requireAuth = true;
  nickname = 'nickname_' + fixture.getHash();
  plainProfileUrl = 'profile_url_' + fixture.getHash();
  metaData: object = {};
  connectionStatus: UserOnlineState = UserOnlineState.OFFLINE;
  isActive = false;
  lastSeenAt = fixture.date + fixture.incremental;
  preferredLanguages: string[] = [];
  friendDiscoveryKey = fixture.getHash();
  friendName = 'friend_name_' + fixture.getHash();

  constructor(params: UserParams) {
    fixture.increaseIncremental();
    Object.entries(params).forEach(([key, value]) => {
      // @ts-ignore
      this[key] = value;
    });
    this.sdk = params?.sdk;
  }

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
