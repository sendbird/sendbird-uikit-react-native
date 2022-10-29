import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Logger } from '@sendbird/uikit-utils';

import Modal from '../../components/Modal';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useHeaderStyle from '../../styles/useHeaderStyle';
import useUIKitTheme from '../../theme/useUIKitTheme';
import DialogBox from '../Dialog/DialogBox';
import LoadingSpinner from '../LoadingSpinner';

export type ActionMenuItem = {
  title?: string;
  menuItems: {
    title: string;
    style?: 'destructive';
    onPress?: (() => Promise<void>) | (() => void);
    onError?: () => void;
  }[];
};

type Props = {
  visible: boolean;
  onHide: () => void;
  onError?: (error: unknown) => void;
  onDismiss?: () => void;
} & ActionMenuItem;
const ActionMenu = ({ visible, onHide, onError, onDismiss, title, menuItems }: Props) => {
  const { statusBarTranslucent } = useHeaderStyle();
  const { colors } = useUIKitTheme();
  const [pending, setPending] = useState(false);
  const _onHide = () => {
    if (!pending) onHide();
  };

  return (
    <Modal
      onClose={_onHide}
      onDismiss={onDismiss}
      statusBarTranslucent={statusBarTranslucent}
      visible={visible}
      backgroundStyle={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <DialogBox>
        <View style={styles.title}>
          <Text
            h1
            color={colors.ui.dialog.default.none.text}
            numberOfLines={1}
            // style={{ flex: 1 }}
            style={{ maxWidth: pending ? '86%' : '100%' }}
          >
            {title}
          </Text>
          {pending && (
            <LoadingSpinner
              size={20}
              color={colors.ui.dialog.default.none.highlight}
              style={{ width: '10%', marginLeft: '4%' }}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          {menuItems.map((item, index) => {
            return (
              <TouchableOpacity
                activeOpacity={0.75}
                key={item.title + index}
                style={styles.button}
                disabled={pending}
                onPress={async () => {
                  setPending(true);
                  try {
                    await item.onPress?.();
                  } catch (e: unknown) {
                    const errorHandler = onError ?? item.onError;
                    errorHandler?.(e);
                    if (!errorHandler) Logger.error('ActionMenu onPress error', e);
                  } finally {
                    onHide();
                    setPending(false);
                  }
                }}
              >
                <Text
                  subtitle2
                  color={
                    item.style === 'destructive'
                      ? colors.ui.dialog.default.none.destructive
                      : colors.ui.dialog.default.none.text
                  }
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </DialogBox>
    </Modal>
  );
};

const styles = createStyleSheet({
  title: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});

export default ActionMenu;
