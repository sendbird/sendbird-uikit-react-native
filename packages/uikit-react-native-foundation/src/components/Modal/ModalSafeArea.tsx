import React, { ReactNode } from 'react';

import { useSafeAreaPadding } from '@sendbird/uikit-utils';

type SafeAreaPadding = {
  paddingTop: number;
  paddingBottom: number;
  paddingStart: number;
  paddingEnd: number;
};

type Props = {
  children: (safeArea: SafeAreaPadding) => ReactNode;
};

const ModalSafeArea = ({ children }: Props) => {
  const safeArea = useSafeAreaPadding(['top', 'bottom', 'left', 'right']);
  return <>{children(safeArea)}</>;
};

export default ModalSafeArea;
