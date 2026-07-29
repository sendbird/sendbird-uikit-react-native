import React, { ReactNode } from 'react';
import { TouchableOpacity, useWindowDimensions } from 'react-native';

import type Icon from '../../components/Icon';
import Modal from '../../components/Modal';
import ModalSafeArea from '../../components/Modal/ModalSafeArea';
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
  const { width } = useWindowDimensions();
  return (
    <Modal
      type={'slide'}
      onClose={onHide}
      onDismiss={onDismiss}
      statusBarTranslucent={statusBarTranslucent}
      visible={visible}
      backgroundStyle={{ alignItems: 'center', justifyContent: 'flex-end' }}
    >
      <ModalSafeArea>
        {(safeArea) => (
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
        )}
      </ModalSafeArea>
    </Modal>
  );
};

export default BottomSheet;
