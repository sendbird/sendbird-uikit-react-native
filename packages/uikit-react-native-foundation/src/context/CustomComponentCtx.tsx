import React from 'react';
import { IncomingMessageContainerRenderProp, OutgoingMessageContainerRenderProp } from '../ui/GroupChannelMessage/MessageContainer';


export type CustomComponentContextType = {
  renderIncomingMessageContainer?: IncomingMessageContainerRenderProp;
  renderOutgoingMessageContainer?: OutgoingMessageContainerRenderProp;
};

type Props = React.PropsWithChildren<CustomComponentContextType>;

export const CustomComponentContext = React.createContext<CustomComponentContextType | null>(null);
export const CustomComponentProvider = ({ children, ...rest  }: Props) => {
  return <CustomComponentContext.Provider value={rest}>{children}</CustomComponentContext.Provider>;
};
