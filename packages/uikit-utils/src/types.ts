/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-empty-interface */
import type React from 'react';

import type SendbirdChat from '@sendbird/chat';
import type {
  BaseChannel,
  Emoji,
  EmojiCategory,
  EmojiContainer,
  RestrictedUser,
  SendbirdError as SBError,
  User,
  UserUpdateParams,
} from '@sendbird/chat';
import type {
  GroupChannel,
  GroupChannelCollection,
  GroupChannelCreateParams,
  GroupChannelListQuery,
  GroupChannelModule,
  GroupChannelUpdateParams,
  Member,
  MessageCollection,
} from '@sendbird/chat/groupChannel';
import type { ModuleNamespaces, SendableMessage } from '@sendbird/chat/lib/__definition';
import type {
  AdminMessage,
  BaseMessage,
  FileMessage,
  FileMessageCreateParams,
  FileMessageUpdateParams,
  PreviousMessageListQuery,
  Reaction,
  UserMessage,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';
import type { OpenChannel, OpenChannelModule } from '@sendbird/chat/openChannel';

export type FilterByValueType<T extends object, Type> = {
  [K in keyof T as T[K] extends Type ? K : never]: T[K];
};

export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

export type OmittedValues<T, K extends keyof T> = Omit<T, K>[keyof Omit<T, K>];

export type PartialDeep<T> = T extends object
  ? T extends Function
    ? T
    : {
        [P in keyof T]?: PartialDeep<T[P]>;
      }
  : T;

export type PartialNullable<T> = {
  [P in keyof T]?: T[P] | null;
};

export type Optional<T> = T | undefined;

export type ContextValue<T extends React.Context<any>> = T extends React.Context<infer V> ? V : never;

export interface UserStruct {
  userId: string;
}

export type SendbirdChatSDK = SendbirdChat & ModuleNamespaces<[GroupChannelModule, OpenChannelModule]>;
export type SendbirdMessage = BaseMessage | FileMessage | UserMessage | AdminMessage | SendableMessage;
export type SendbirdChannel = BaseChannel | GroupChannel | OpenChannel;
export type SendbirdUserMessage = UserMessage;
export type SendbirdFileMessage = FileMessage;
export type SendbirdAdminMessage = AdminMessage;
export type SendbirdBaseMessage = BaseMessage;
export type SendbirdSendableMessage = SendableMessage;
export type SendbirdFileMessageCreateParams = FileMessageCreateParams;
export type SendbirdFileMessageUpdateParams = FileMessageUpdateParams;
export type SendbirdUserMessageCreateParams = UserMessageCreateParams;
export type SendbirdUserMessageUpdateParams = UserMessageUpdateParams;
export type SendbirdGroupChannelCreateParams = GroupChannelCreateParams;
export type SendbirdGroupChannelUpdateParams = GroupChannelUpdateParams;
export type SendbirdUserUpdateParams = UserUpdateParams;
export type SendbirdUser = User;
export type SendbirdRestrictedUser = RestrictedUser;
export type SendbirdMember = Member;
export type SendbirdGroupChannel = GroupChannel;
export type SendbirdBaseChannel = BaseChannel;
export type SendbirdOpenChannel = OpenChannel;

export type SendbirdReaction = Reaction;
export type SendbirdEmoji = Emoji;
export type SendbirdEmojiCategory = EmojiCategory;
export type SendbirdEmojiContainer = EmojiContainer;

export type SendbirdGroupChannelCollection = GroupChannelCollection;
export type SendbirdGroupChannelListQuery = GroupChannelListQuery;
export type SendbirdMessageCollection = MessageCollection;
export type SendbirdPreviousMessageListQuery = PreviousMessageListQuery;

export type SendbirdError = SBError;

export interface SendbirdDataPayload {
  app_id: string;
  audience_type: string;
  category: string;
  channel: {
    channel_unread_message_count: number;
    channel_url: string;
    custom_type: string;
    name: string;
  };
  channel_type: string;
  created_at: number;
  custom_type: string;
  files: NotificationFiles[];
  mentioned_users: NotificationMentionedUsers[];
  message: string;
  message_id: number;
  push_sound: string;
  push_title: null;
  recipient: {
    id: string;
    name: string;
    push_template: string;
  };
  sender?: {
    id: string;
    name: string;
    profile_url: string;
    require_auth_for_profile_image: boolean;
  };
  sqs_ts: number;
  translations: NotificationTranslations;
  type: 'ADMM' | 'MESG' | 'FILE' | string;
  unread_message_count: number;
}
export interface NotificationFiles {
  type: string;
  url: string;
  name: string;
  size: number;
  require_auth: boolean;
}

export interface NotificationTranslations {}
export interface NotificationMentionedUsers {}
