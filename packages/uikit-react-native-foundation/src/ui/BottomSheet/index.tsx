import React, { ReactNode } from 'react';
import { TouchableOpacity, useWindowDimensions } from 'react-native';

import { useSafeAreaPadding } from '@sendbird/uikit-utils';

import type Icon from '../../components/Icon';
import Modal from '../../components/Modal';
import useHeaderStyle from '../../styles/useHeaderStyle';
import DialogSheet from '../Dialog/DialogSheet';

type HeaderProps = { onClose: () => Promise<void> };
export type BottomSheetItem = {
  sheetItems: {
    icon?: keyof typeof Icon.Assets;
    iconColor?: string;
    title: string;
    titleColor?: string;
    disabled?: boolean;
    onPress: () => void;
  }[];
  HeaderComponent?: (props: HeaderProps) => ReactNode;
};
type Props = {
  visible: boolean;
  onHide: () => Promise<void>;
  onError?: (error: unknown) => void;
  onDismiss?: () => void;
} & BottomSheetItem;
const BottomSheet = ({ onDismiss, onHide, visible, sheetItems, HeaderComponent }: Props) => {
  const { statusBarTranslucent } = useHeaderStyle();
  return (
    <Modal
      type={'slide'}
      onClose={onHide}
      onDismiss={onDismiss}
      statusBarTranslucent={statusBarTranslucent}
      visible={visible}
      backgroundStyle={{ alignItems: 'center', justifyContent: 'flex-end' }}
    >
      <BottomSheetContent onHide={onHide} sheetItems={sheetItems} HeaderComponent={HeaderComponent} />
    </Modal>
  );
};

// NOTE: Reads the safe area inside the modal on purpose, see `ModalSafeAreaBottom`.
const BottomSheetContent = ({ onHide, sheetItems, HeaderComponent }: Pick<Props, 'onHide'> & BottomSheetItem) => {
  const { width } = useWindowDimensions();
  const safeArea = useSafeAreaPadding(['bottom', 'left', 'right']);
  return (
    <DialogSheet style={{ width, paddingBottom: safeArea.paddingBottom }}>
      {HeaderComponent && <HeaderComponent onClose={onHide} />}
      {sheetItems.map(({ onPress, ...props }, idx) => (
        <TouchableOpacity
          activeOpacity={0.75}
          key={props.title + idx}
          style={{ paddingStart: safeArea.paddingStart, paddingEnd: safeArea.paddingEnd }}
          disabled={props.disabled}
          onPress={async () => {
            await onHide();
            try {
              onPress();
            } catch {}
          }}
        >
          <DialogSheet.Item {...props} />
        </TouchableOpacity>
      ))}
    </DialogSheet>
  );
};

export default BottomSheet;
