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

export type SendbirdChatSDK = Sendbird.SendBirdInstance;
export type SendbirdMessage =
  | Sendbird.BaseMessageInstance
  | Sendbird.FileMessage
  | Sendbird.UserMessage
  | Sendbird.AdminMessage;
export type SendbirdChannel = Sendbird.BaseChannel | Sendbird.GroupChannel | Sendbird.OpenChannel;