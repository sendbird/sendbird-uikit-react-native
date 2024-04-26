import { SendbirdBaseMessage, SendbirdEmoji, SendbirdReaction } from '@gathertown/uikit-utils';
import React from 'react';

import { AlertRenderProp } from '../ui/Alert';
import { BottomSheetRenderProp } from '../ui/BottomSheet';
import { AdminMessageRenderProp } from '../ui/GroupChannelMessage/Message.admin';
import { FileMessageRenderProp } from '../ui/GroupChannelMessage/Message.file';
import { UnknownMessageRenderProp } from '../ui/GroupChannelMessage/Message.unknown';
import { UserMessageRenderProp } from '../ui/GroupChannelMessage/Message.user';
import {
  IncomingMessageContainerRenderProp,
  OutgoingMessageContainerRenderProp,
} from '../ui/GroupChannelMessage/MessageContainer';

type GenericMessageRenderProp = (props: { content: React.ReactNode }) => React.ReactElement;

export type EmojiSelectorRenderProp = (props: {
  emojis: SendbirdEmoji[];
  message: SendbirdBaseMessage;
  onPress: (key: string, react: boolean) => void;
}) => React.ReactElement;
export type MessageReactionsRenderProp = (props: {
  getEmoji: (key: string) => SendbirdEmoji;
  message: SendbirdBaseMessage;
  currentUserId?: string;
  openReactionUserList: (idx: number) => void;
  onReactionPress: (reaction: SendbirdReaction) => void;
}) => React.ReactElement;

export type ReactionBottomSheetUserListRenderProp = (props: {
  onClose: () => Promise<void>;
  onDismiss: VoidFunction;
  visible: boolean;
  message?: SendbirdBaseMessage;
  getEmoji: (key: string) => SendbirdEmoji;
  initialFocusIndex: number;
}) => React.ReactElement;

export type CustomComponentContextType = {
  renderIncomingMessageContainer?: IncomingMessageContainerRenderProp;
  renderOutgoingMessageContainer?: OutgoingMessageContainerRenderProp;
  renderAlert?: AlertRenderProp;
  renderBottomSheet?: BottomSheetRenderProp;
  renderUserMessage?: UserMessageRenderProp;
  renderFileMessage?: FileMessageRenderProp;
  renderGenericMessage?: GenericMessageRenderProp;
  renderAdminMessage?: AdminMessageRenderProp;
  renderUnknownMessage?: UnknownMessageRenderProp;
  renderEmojiSelector?: EmojiSelectorRenderProp;
  renderMessageReactionsRenderProp?: MessageReactionsRenderProp;
  renderReactionBottomSheetUserListRenderProp?: ReactionBottomSheetUserListRenderProp;
};

type Props = React.PropsWithChildren<CustomComponentContextType>;

export const CustomComponentContext = React.createContext<CustomComponentContextType | null>(null);
export const CustomComponentProvider = ({ children, ...rest }: Props) => {
  return <CustomComponentContext.Provider value={rest}>{children}</CustomComponentContext.Provider>;
};
export type { BottomSheetRenderProp } from '../ui/BottomSheet';

export type {
  UnknownMessageRenderProp,
  GenericMessageRenderProp,
  FileMessageRenderProp,
  UserMessageRenderProp,
  IncomingMessageContainerRenderProp,
  OutgoingMessageContainerRenderProp,
  AdminMessageRenderProp,
};
