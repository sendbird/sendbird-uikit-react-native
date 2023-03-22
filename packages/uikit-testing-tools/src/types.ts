import type { MockSendbirdChatSDK } from '@sendbird/uikit-testing-tools';

type MockBasicParams = { sdk: MockSendbirdChatSDK };

export type GetMockParams<T> = Partial<T & MockBasicParams>;
export type GetMockProps<Params, T> = { params: Params } & T;
