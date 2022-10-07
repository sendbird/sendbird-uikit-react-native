import React from 'react';
import { AlertButton, View } from 'react-native';

import Modal from '../../components/Modal';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useHeaderStyle from '../../styles/useHeaderStyle';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Button from '../Button';
import DialogBox from '../Dialog/DialogBox';

export type AlertItem = {
  title?: string;
  message?: string;
  buttons?: AlertButton[];
};

type Props = {
  visible: boolean;
  onHide: () => void;
  onDismiss?: () => void;
} & AlertItem;
const Alert = ({ onDismiss, visible, onHide, title = '', message = '', buttons = [{ text: 'OK' }] }: Props) => {
  const { statusBarTranslucent } = useHeaderStyle();
  const { colors } = useUIKitTheme();

  return (
    <Modal
      onClose={onHide}
      onDismiss={onDismiss}
      statusBarTranslucent={statusBarTranslucent}
      visible={visible}
      backgroundStyle={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <DialogBox style={styles.container}>
        {Boolean(title) && (
          <View style={styles.titleContainer}>
            <Text h1 color={colors.ui.dialog.default.none.text} numberOfLines={1} style={{ flex: 1 }}>
              {title}
            </Text>
          </View>
        )}

        <View style={styles.messageContainer}>
          {Boolean(message) && (
            <Text
              subtitle2={!title}
              body3={Boolean(title)}
              color={!title ? colors.ui.dialog.default.none.text : colors.ui.dialog.default.none.message}
              numberOfLines={3}
            >
              {message}
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {buttons.map(({ text = 'OK', style = 'default', onPress }, index) => {
            return (
              <Button
                key={text + index}
                variant={'text'}
                style={styles.button}
                onPress={async () => {
                  try {
                    onPress?.();
                  } finally {
                    onHide();
                  }
                }}
                contentColor={
                  style === 'destructive'
                    ? colors.ui.dialog.default.none.destructive
                    : colors.ui.dialog.default.none.highlight
                }
              >
                {text}
              </Button>
            );
          })}
        </View>
      </DialogBox>
    </Modal>
  );
};

const styles = createStyleSheet({
  container: {
    paddingTop: 20,
  },
  titleContainer: {
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageContainer: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  button: {
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 12,
  },
});

export default Alert;
