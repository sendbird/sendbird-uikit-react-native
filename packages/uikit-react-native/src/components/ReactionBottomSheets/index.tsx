import type React from 'react';

import { SendbirdReactedUserInfo } from '@sendbird/uikit-utils';

import type { LocalizationContext } from '../../contexts/LocalizationCtx';
import type { ReactionContext } from '../../contexts/ReactionCtx';
import type { SendbirdChatContext } from '../../contexts/SendbirdChatCtx';
import ReactionList from './ReactionListBottomSheet';
import UserList from './ReactionUserListBottomSheet';

type GetFromContext<T> = T extends React.Context<infer Value> ? NonNullable<Value> : never;
export type ReactionBottomSheetProps = {
  visible: boolean;
  onDismiss: () => void;
  onClose: () => Promise<void>;
  onPressUserProfile: (user: SendbirdReactedUserInfo) => void;
  chatCtx: GetFromContext<typeof SendbirdChatContext>;
  reactionCtx: GetFromContext<typeof ReactionContext>;
  localizationCtx: GetFromContext<typeof LocalizationContext>;
};

export const ReactionBottomSheets = {
  ReactionList,
  UserList,
};
