import React from 'react';
import { TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useHeaderStyle from '../../styles/useHeaderStyle';
import DialogSheet from '../Dialog/DialogSheet';
import type Icon from '../Icon';
import Modal from '../Modal';

export type BottomSheetItem = {
  sheetItems: {
    icon?: keyof typeof Icon.Assets;
    iconColor?: string;
    title: string;
    titleColor?: string;
    onPress: () => void;
  }[];
};
type Props = {
  visible: boolean;
  onHide: () => void;
  onError?: (error: unknown) => void;
  onDismiss?: () => void;
} & BottomSheetItem;
const BottomSheet: React.FC<Props> = ({ onDismiss, onHide, visible, sheetItems }) => {
  const { statusBarTranslucent } = useHeaderStyle();
  const { width } = useWindowDimensions();
  const { bottom, left, right } = useSafeAreaInsets();
  return (
    <Modal
      type={'slide'}
      onClose={onHide}
      onDismiss={onDismiss}
      statusBarTranslucent={statusBarTranslucent}
      visible={visible}
      backgroundStyle={{ alignItems: 'center', justifyContent: 'flex-end' }}
    >
      <DialogSheet style={{ width, paddingBottom: bottom }}>
        {sheetItems.map(({ onPress, ...props }, idx) => (
          <TouchableOpacity
            activeOpacity={0.75}
            key={props.title + idx}
            style={{ paddingLeft: left, paddingRight: right }}
            onPress={async () => {
              try {
                await onPress();
              } finally {
                onHide();
              }
            }}
          >
            <DialogSheet.Item {...props} />
          </TouchableOpacity>
        ))}
      </DialogSheet>
    </Modal>
  );
};

export default BottomSheet;
