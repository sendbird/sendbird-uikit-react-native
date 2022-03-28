/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-empty-interface */
import type React from 'react';
import type Sendbird from 'sendbird';

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

export type SendbirdChatSDK = Sendbird.SendBirdInstance & { get isCacheEnabled(): boolean };
export type SendbirdMessage =
  | Sendbird.BaseMessageInstance
  | Sendbird.FileMessage
  | Sendbird.UserMessage
  | Sendbird.AdminMessage;
export type SendbirdChannel = Sendbird.BaseChannel | Sendbird.GroupChannel | Sendbird.OpenChannel;

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
