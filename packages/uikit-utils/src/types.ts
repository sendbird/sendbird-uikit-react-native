/* eslint-disable @typescript-eslint/no-explicit-any */
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
