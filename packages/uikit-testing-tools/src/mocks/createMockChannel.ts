// @ts-nocheck
import {
  BannedUserListQuery,
  ChannelType,
  FileUploadResult,
  MetaCounter,
  MetaData,
  MutedInfo,
  MutedUserListQuery,
  OperatorListQuery,
  PushTriggerOption,
  Role,
} from '@sendbird/chat';
import {
  CountPreference,
  HiddenState,
  MemberListOrder,
  MemberListQuery,
  MemberListQueryParams,
  MemberState,
  MemberStateFilter,
  MessageCollectionParams,
  MutedMemberFilter,
  MutedState,
  OperatorFilter,
  ReadStatus,
} from '@sendbird/chat/groupChannel';
import {
  BaseListQueryParams,
  DeliveryStatus,
  MultipleFilesMessageCreateParams,
  MultipleFilesMessageRequestHandler,
  PinnedMessageListQuery,
  PinnedMessageListQueryParams,
} from '@sendbird/chat/lib/__definition';
import { FileCompat } from '@sendbird/chat/lib/__definition';
import {
  MessageChangelogs,
  MessageRequestHandler,
  MessageTypeFilter,
  PreviousMessageListQuery,
  PreviousMessageListQueryParams,
  ReactionEvent,
  ReplyType,
} from '@sendbird/chat/message';
import type { ParticipantListQuery } from '@sendbird/chat/openChannel';
import type { Poll, PollChangelogs, PollListQuery, PollVoteEvent, PollVoterListQuery } from '@sendbird/chat/poll';
import type {
  SendbirdBaseChannel,
  SendbirdBaseMessage,
  SendbirdFeedChannel,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdMember,
  SendbirdMessageCollection,
  SendbirdMultipleFilesMessage,
  SendbirdOpenChannel,
  SendbirdRestrictedUser,
  SendbirdUserMessage,
} from '@sendbird/uikit-utils';

import type { GetMockParams, GetMockProps } from '../types';
import { createTestContext } from '../utils/createTestContext';
import { createMockMessage } from './createMockMessage';
import { createMockMessageCollection } from './createMockMessageCollection';
import { createMockQuery } from './createMockQuery';
import { createMockUser } from './createMockUser';

const tc = createTestContext();

type Params = GetMockParams<SendbirdOpenChannel & SendbirdGroupChannel>;

export const createMockChannel = (params: Params) => {
  return new MockChannel(params);
};

class MockChannel implements GetMockProps<Params, SendbirdBaseChannel & SendbirdOpenChannel & SendbirdGroupChannel> {
  constructor(public params: Params) {
    tc.increaseIncrement();
    Object.assign(this, params);
  }

  channelType: ChannelType = ChannelType.BASE;
  url = 'channel_url_' + tc.getHash();
  name = 'channel_name_' + tc.getHash();
  coverUrl = 'channel_cover_url_' + tc.getHash();
  isFrozen = false;
  isEphemeral = false;
  customType = '';
  data = '';
  creator = createMockUser({ userId: 'creator-user-id' });
  createdAt: number = tc.date + tc.increment;
  participantCount = 0;
  operators = [];
  hiddenState = HiddenState.UNHIDDEN;
  invitedAt = Date.now();
  inviter = createMockUser({ userId: 'inviter-user-id' });
  readonly isAccessCodeRequired = false;
  readonly isBroadcast = false;
  readonly isDiscoverable = true;
  readonly isDistinct = false;
  readonly isExclusive = false;
  readonly isPublic = true;
  readonly isSuper = false;
  readonly isPushEnabled = true;
  readonly isChatNotification = false;
  joinedAt = Date.now();
  joinedMemberCount = 0;
  lastMessage = createMockMessage({});
  lastPinnedMessage = createMockMessage({});
  memberCount = 0;
  members = [];
  messageOffsetTimestamp = 0;
  messageSurvivalSeconds = 0;
  myCountPreference = CountPreference.ALL;
  myLastRead = 0;
  myMemberState = MemberState.JOINED;
  myMutedState = MutedState.UNMUTED;
  myPushTriggerOption = PushTriggerOption.ALL;
  myRole = Role.NONE;
  pinnedMessageIds = [];
  unreadMentionCount = 0;
  unreadMessageCount = 0;
  totalUnreadReplyCount = 0;

  serialize(): object {
    throw new Error('Method not implemented.');
  }
  isOperator(): boolean {
    throw new Error('Method not implemented.');
  }
  // @ts-ignore
  refresh = jest.fn(async (): Promise<this> => {
    this.params.sdk?.__throwIfFailureTest();
    return this;
  });

  enter = jest.fn(async () => {
    this.params.sdk?.__throwIfFailureTest();
  });
  exit = jest.fn(async () => {
    this.params.sdk?.__throwIfFailureTest();
  });
  delete = jest.fn(async () => {
    this.params.sdk?.__throwIfFailureTest();
  });
  updateChannel = jest.fn();
  updateChannelWithOperatorUserIds = jest.fn();

  get cachedMetaData(): object {
    throw new Error('Method not implemented.');
  }
  isIdentical(channel: SendbirdBaseChannel): boolean {
    return this.url === channel.url;
  }
  isEqual(channel: SendbirdBaseChannel): boolean {
    return Object.is(channel, this);
  }
  createOperatorListQuery = jest.fn((params?: BaseListQueryParams | undefined): OperatorListQuery => {
    const query = createMockQuery<SendbirdRestrictedUser>({
      type: 'user',
      dataLength: 50,
      limit: params?.limit,
      sdk: this.params.sdk,
    });
    return {
      channelType: ChannelType.BASE,
      channelUrl: 'channel_url_' + tc.getHash(),
      ...query,
    };
  });
  createMutedUserListQuery = jest.fn((params?: BaseListQueryParams | undefined): MutedUserListQuery => {
    const query = createMockQuery<SendbirdRestrictedUser>({
      type: 'user',
      dataLength: 50,
      limit: params?.limit,
      sdk: this.params.sdk,
    });
    return {
      channelType: ChannelType.BASE,
      channelUrl: 'channel_url_' + tc.getHash(),
      ...query,
    };
  });
  createBannedUserListQuery = jest.fn((params?: BaseListQueryParams | undefined): BannedUserListQuery => {
    const query = createMockQuery<SendbirdRestrictedUser>({
      type: 'user',
      dataLength: 50,
      limit: params?.limit,
      sdk: this.params.sdk,
    });
    return {
      channelType: ChannelType.BASE,
      channelUrl: 'channel_url_' + tc.getHash(),
      ...query,
    };
  });

  createParticipantListQuery = jest.fn((params: BaseListQueryParams): ParticipantListQuery => {
    const query = createMockQuery<SendbirdRestrictedUser>({
      type: 'user',
      dataLength: 50,
      limit: params?.limit,
      sdk: this.params.sdk,
    });
    return {
      channelType: ChannelType.OPEN,
      channelUrl: 'channel_url_' + tc.getHash(),
      ...query,
    };
  });
  createMemberListQuery = jest.fn((params?: MemberListQueryParams): MemberListQuery => {
    const query = createMockQuery<SendbirdMember>({
      type: 'user',
      dataLength: 50,
      limit: params?.limit,
      sdk: this.params.sdk,
    });
    return {
      channelType: ChannelType.GROUP,
      memberStateFilter: MemberStateFilter.ALL,
      mutedMemberFilter: MutedMemberFilter.ALL,
      nicknameStartsWithFilter: '',
      operatorFilter: OperatorFilter.ALL,
      order: MemberListOrder.MEMBER_NICKNAME_ALPHABETICAL,
      channelUrl: 'channel_url_' + tc.getHash(),
      ...query,
    };
  });
  createPreviousMessageListQuery = jest.fn(function (
    params?: PreviousMessageListQueryParams | undefined,
  ): PreviousMessageListQuery {
    const query = createMockQuery<SendbirdBaseMessage>({
      type: 'message',
      dataLength: 300,
      limit: params?.limit,
      sdk: this.params.sdk,
    });
    return {
      reverse: false,
      channelType: ChannelType.BASE,
      channelUrl: 'channel_url_' + tc.getHash(),
      customTypesFilter: [],
      includeMetaArray: false,
      includeParentMessageInfo: false,
      includeReactions: false,
      includeThreadInfo: false,
      messageTypeFilter: MessageTypeFilter.ALL,
      replyType: ReplyType.NONE,
      senderUserIdsFilter: [],
      showSubchannelMessagesOnly: false,
      load: query.next,
      ...query,
    };
  });
  createMessageCollection = jest.fn((params?: MessageCollectionParams | undefined): SendbirdMessageCollection => {
    return createMockMessageCollection({
      ...params,
      sdk: this.params.sdk,
      groupChannel: this.asGroupChannel(),
    }).asMessageCollection();
  });

  addOperators(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  removeOperators(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getMyMutedInfo(): Promise<MutedInfo> {
    throw new Error('Method not implemented.');
  }
  getMetaData(): Promise<MetaData> {
    throw new Error('Method not implemented.');
  }
  getAllMetaData(): Promise<MetaData> {
    throw new Error('Method not implemented.');
  }
  createMetaData(): Promise<MetaData> {
    throw new Error('Method not implemented.');
  }
  updateMetaData(): Promise<MetaData> {
    throw new Error('Method not implemented.');
  }
  deleteMetaData(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteAllMetaData(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getMetaCounters(): Promise<MetaCounter> {
    throw new Error('Method not implemented.');
  }
  getAllMetaCounters(): Promise<MetaCounter> {
    throw new Error('Method not implemented.');
  }
  createMetaCounters(): Promise<MetaCounter> {
    throw new Error('Method not implemented.');
  }
  updateMetaCounters(): Promise<MetaCounter> {
    throw new Error('Method not implemented.');
  }
  increaseMetaCounters(): Promise<MetaCounter> {
    throw new Error('Method not implemented.');
  }
  decreaseMetaCounters(): Promise<MetaCounter> {
    throw new Error('Method not implemented.');
  }
  deleteMetaCounter(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteAllMetaCounters(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  muteUser(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  muteUserWithUserId(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  unmuteUser(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  unmuteUserWithUserId(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  banUser(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  banUserWithUserId(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  unbanUser(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  unbanUserWithUserId(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  freeze(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  unfreeze(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getMessagesByMessageId(): Promise<SendbirdBaseMessage[]> {
    throw new Error('Method not implemented.');
  }
  getMessagesByTimestamp(): Promise<SendbirdBaseMessage[]> {
    throw new Error('Method not implemented.');
  }
  getMessageChangeLogsSinceTimestamp(): Promise<MessageChangelogs> {
    throw new Error('Method not implemented.');
  }
  getMessageChangeLogsSinceToken(): Promise<MessageChangelogs> {
    throw new Error('Method not implemented.');
  }
  resendMessage(
    failedMessage: SendbirdMultipleFilesMessage,
  ): MultipleFilesMessageRequestHandler<SendbirdMultipleFilesMessage>;
  resendMessage(failedMessage: SendbirdFileMessage, file?: FileCompat): MessageRequestHandler<SendbirdFileMessage>;
  resendMessage(failedMessage: SendbirdUserMessage): MessageRequestHandler<SendbirdUserMessage>;
  resendMessage(): unknown {
    throw new Error('Method not implemented.');
  }
  copyMessage(
    channel: SendbirdGroupChannel,
    message: SendbirdMultipleFilesMessage,
  ): MessageRequestHandler<SendbirdMultipleFilesMessage>;
  copyMessage(channel: SendbirdBaseChannel, message: SendbirdFileMessage): MessageRequestHandler<SendbirdFileMessage>;
  copyMessage(channel: SendbirdBaseChannel, message: SendbirdUserMessage): MessageRequestHandler<SendbirdUserMessage>;
  copyMessage(): unknown {
    throw new Error('Method not implemented.');
  }
  sendUserMessage(): MessageRequestHandler {
    throw new Error('Method not implemented.');
  }
  resendUserMessage(): Promise<SendbirdUserMessage> {
    throw new Error('Method not implemented.');
  }
  updateUserMessage(): Promise<SendbirdUserMessage> {
    throw new Error('Method not implemented.');
  }
  copyUserMessage(): Promise<SendbirdUserMessage> {
    throw new Error('Method not implemented.');
  }
  translateUserMessage(): Promise<SendbirdUserMessage> {
    throw new Error('Method not implemented.');
  }
  sendFileMessage(): MessageRequestHandler {
    throw new Error('Method not implemented.');
  }
  sendFileMessages(): MessageRequestHandler {
    throw new Error('Method not implemented.');
  }
  resendFileMessage(): Promise<SendbirdFileMessage> {
    throw new Error('Method not implemented.');
  }
  updateFileMessage(): Promise<SendbirdFileMessage> {
    throw new Error('Method not implemented.');
  }
  cancelUploadingFileMessage(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  copyFileMessage(): Promise<SendbirdFileMessage> {
    throw new Error('Method not implemented.');
  }
  deleteMessage(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  addReaction(): Promise<ReactionEvent> {
    throw new Error('Method not implemented.');
  }
  deleteReaction(): Promise<ReactionEvent> {
    throw new Error('Method not implemented.');
  }
  createMessageMetaArrayKeys(): Promise<SendbirdBaseMessage> {
    throw new Error('Method not implemented.');
  }
  deleteMessageMetaArrayKeys(): Promise<SendbirdBaseMessage> {
    throw new Error('Method not implemented.');
  }
  addMessageMetaArrayValues(): Promise<SendbirdBaseMessage> {
    throw new Error('Method not implemented.');
  }
  removeMessageMetaArrayValues(): Promise<SendbirdBaseMessage> {
    throw new Error('Method not implemented.');
  }
  report(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  reportUser(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  reportMessage(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  isOpenChannel(): this is SendbirdOpenChannel {
    return this.channelType === ChannelType.OPEN;
  }
  isGroupChannel(): this is SendbirdGroupChannel {
    return this.channelType === ChannelType.GROUP;
  }
  isFeedChannel(): this is SendbirdFeedChannel {
    return this.channelType === ChannelType.FEED;
  }
  asOpenChannel(): SendbirdOpenChannel {
    return this as unknown as SendbirdOpenChannel;
  }
  asGroupChannel(): SendbirdGroupChannel {
    return this as unknown as SendbirdGroupChannel;
  }

  acceptInvitation = jest.fn();

  addMember = jest.fn();

  addPollOption = jest.fn();

  get cachedUndeliveredMemberState(): object {
    return {};
  }

  get cachedUnreadMemberState(): object {
    return {};
  }

  cancelScheduledMessage = jest.fn();

  closePoll = jest.fn();

  createPollListQuery(): PollListQuery {
    throw new Error('Method not implemented.');
  }

  createPollVoterListQuery(): PollVoterListQuery {
    throw new Error('Method not implemented.');
  }

  deletePoll(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  deletePollOption(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  endTyping(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getMyPushTriggerOption(): Promise<PushTriggerOption> {
    throw new Error('Method not implemented.');
  }

  getPollChangeLogsSinceTimestamp(): Promise<PollChangelogs> {
    throw new Error('Method not implemented.');
  }

  getPollChangeLogsSinceToken(): Promise<PollChangelogs> {
    throw new Error('Method not implemented.');
  }

  getReadMembers(): SendbirdMember[] {
    return [];
  }

  getReadStatus(): { [p: string]: ReadStatus } {
    return {};
  }

  getTypingUsers(): SendbirdMember[] {
    return [];
  }
  getDeliveryStatus(): { [p: string]: DeliveryStatus } {
    return {};
  }

  getUndeliveredMemberCount = jest.fn(() => 0);

  getUnreadMemberCount = jest.fn(() => 0);

  getUnreadMembers = jest.fn(() => []);

  hide(): Promise<SendbirdGroupChannel> {
    throw new Error('Method not implemented.');
  }

  invalidateTypingStatus(): boolean {
    return false;
  }

  invite(): Promise<SendbirdGroupChannel> {
    throw new Error('Method not implemented.');
  }

  inviteWithUserIds(): Promise<SendbirdGroupChannel> {
    throw new Error('Method not implemented.');
  }

  get isHidden(): boolean {
    return false;
  }

  isReadMessage(): boolean {
    return false;
  }

  get isTyping(): boolean {
    return false;
  }

  join(): Promise<SendbirdGroupChannel> {
    throw new Error('Method not implemented.');
  }

  leave(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  markAsDelivered(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  markAsRead(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  pinMessage(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  removeMember(): boolean {
    throw new Error('Method not implemented.');
  }

  resetMyHistory(): Promise<SendbirdGroupChannel> {
    throw new Error('Method not implemented.');
  }

  sendScheduledMessageNow(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  setMyCountPreference(): Promise<CountPreference> {
    throw new Error('Method not implemented.');
  }

  setMyPushTriggerOption(): Promise<PushTriggerOption> {
    throw new Error('Method not implemented.');
  }

  startTyping(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  unhide(): Promise<SendbirdGroupChannel> {
    throw new Error('Method not implemented.');
  }

  unpinMessage(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  updatePoll(): Promise<Poll> {
    throw new Error('Method not implemented.');
  }

  updatePollOption(): Promise<Poll> {
    throw new Error('Method not implemented.');
  }

  updateScheduledFileMessage(): Promise<SendbirdFileMessage> {
    throw new Error('Method not implemented.');
  }

  updateScheduledUserMessage(): Promise<SendbirdUserMessage> {
    throw new Error('Method not implemented.');
  }

  votePoll(): Promise<PollVoteEvent> {
    throw new Error('Method not implemented.');
  }

  createScheduledFileMessage(): MessageRequestHandler {
    throw new Error('Method not implemented.');
  }

  createScheduledUserMessage(): MessageRequestHandler {
    throw new Error('Method not implemented.');
  }

  declineInvitation(): Promise<SendbirdGroupChannel> {
    throw new Error('Method not implemented.');
  }

  get messageCollectionLastAccessedAt(): number {
    throw new Error('Method not implemented.');
  }

  createThreadedParentMessageListQuery(): PreviousMessageListQuery {
    throw new Error('Method not implemented.');
  }
  createPinnedMessageListQuery(_params?: PinnedMessageListQueryParams | undefined): PinnedMessageListQuery {
    throw new Error('Method not implemented.');
  }
  sendMultipleFilesMessage(_params: MultipleFilesMessageCreateParams): MultipleFilesMessageRequestHandler {
    throw new Error('Method not implemented.');
  }
  uploadFile(): Promise<FileUploadResult> {
    throw new Error('Method not implemented.');
  }
}
