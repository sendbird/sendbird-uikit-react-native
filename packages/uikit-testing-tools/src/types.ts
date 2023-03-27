import type { MockSendbirdChatSDK } from './mocks/createMockSendbirdSDK';

type MockBasicParams = { sdk: MockSendbirdChatSDK };

export type GetMockParams<T> = Partial<T & MockBasicParams>;
export type GetMockProps<Params, T> = { params: Params } & T;
