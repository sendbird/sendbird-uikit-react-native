import React from 'react';
import { AlertRenderProp } from '../ui/Alert';

import { BottomSheetRenderProp } from '../ui/BottomSheet';
import {
  IncomingMessageContainerRenderProp,
  OutgoingMessageContainerRenderProp,
} from '../ui/GroupChannelMessage/MessageContainer';
import { AdminMessageRenderProp } from '../ui/GroupChannelMessage/Message.admin';
import { FileMessageRenderProp } from '../ui/GroupChannelMessage/Message.file';
import { UnknownMessageRenderProp } from '../ui/GroupChannelMessage/Message.unknown';
import { UserMessageRenderProp } from '../ui/GroupChannelMessage/Message.user';


type GenericMessageRenderProp = (props: { content: React.ReactNode }) => React.ReactElement;

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
};

type Props = React.PropsWithChildren<CustomComponentContextType>;

export const CustomComponentContext = React.createContext<CustomComponentContextType | null>(null);
export const CustomComponentProvider = ({ children, ...rest }: Props) => {
  return <CustomComponentContext.Provider value={rest}>{children}</CustomComponentContext.Provider>;
};
export type { BottomSheetRenderProp } from '../ui/BottomSheet';

export type{
  UnknownMessageRenderProp,
  GenericMessageRenderProp,
  FileMessageRenderProp,
  UserMessageRenderProp,
  IncomingMessageContainerRenderProp,
  OutgoingMessageContainerRenderProp,
  AdminMessageRenderProp,
};
