import React from 'react';

type Props = React.PropsWithChildren<{
  // renderAlertModal: (props: ComponentProps<typeof Alert>) => React.ReactElement;
}>;

export type CustomComponentContextType = {
  // renderAlertModal: (props: ComponentProps<typeof Alert>) => React.ReactElement;
};

export const CustomComponentContext = React.createContext<CustomComponentContextType | null>(null);
export const CustomComponentProvider = ({ children, ...rest  }: Props) => {
  return <CustomComponentContext.Provider value={rest}>{children}</CustomComponentContext.Provider>;
};
