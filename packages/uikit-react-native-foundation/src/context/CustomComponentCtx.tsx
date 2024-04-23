import React from 'react';
import { AlertRenderProp } from '../ui/Alert';

import { BottomSheetRenderProp } from '../ui/BottomSheet';
import {
  IncomingMessageContainerRenderProp,
  OutgoingMessageContainerRenderProp,
} from '../ui/GroupChannelMessage/MessageContainer';

export type CustomComponentContextType = {
  renderIncomingMessageContainer?: IncomingMessageContainerRenderProp;
  renderOutgoingMessageContainer?: OutgoingMessageContainerRenderProp;
  renderAlert?: AlertRenderProp;
  renderBottomSheet?: BottomSheetRenderProp;
};

type Props = React.PropsWithChildren<CustomComponentContextType>;

export const CustomComponentContext = React.createContext<CustomComponentContextType | null>(null);
export const CustomComponentProvider = ({ children, ...rest }: Props) => {
  return <CustomComponentContext.Provider value={rest}>{children}</CustomComponentContext.Provider>;
};
export type { BottomSheetRenderProp } from '../ui/BottomSheet';
