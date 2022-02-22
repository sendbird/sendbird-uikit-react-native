import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleProp, View, ViewStyle } from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';
import useHeaderStyle from '../../styles/useHeaderStyle';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Modal from '../Modal';
import Text from '../Text';

export type DialogueItems = {
  title: string;
  onPress?: () => void;
};
type Props = {
  visible: boolean;
  onHide: () => void;
  onError?: (error: unknown) => void;

  containerStyle?: StyleProp<ViewStyle>;
  title?: string;
  items: DialogueItems[];
};
const Dialogue: React.FC<Props> = ({ containerStyle, visible, onHide, onError, title, items, children }) => {
  const { statusBarTranslucent } = useHeaderStyle();
  const { colors } = useUIKitTheme();
  const [pending, setPending] = useState(false);

  const _onHide = () => {
    if (!pending) onHide();
  };
  return (
    <>
      <Modal
        statusBarTranslucent={statusBarTranslucent}
        visible={visible}
        onPressBackground={_onHide}
        backgroundStyle={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <View style={[styles.container, { backgroundColor: colors.background }, containerStyle]}>
          <View style={styles.title}>
            <Text h1 color={colors.onBackground01} numberOfLines={1} style={{ maxWidth: pending ? '86%' : '100%' }}>
              {title}
            </Text>
            {pending && (
              <ActivityIndicator size={'small'} color={colors.primary} style={{ width: '10%', marginLeft: '4%' }} />
            )}
          </View>
          <View style={styles.buttonContainer}>
            {items.map(({ title, onPress }, index) => {
              return (
                <Pressable
                  key={title + index}
                  style={styles.button}
                  disabled={pending}
                  onPress={async () => {
                    setPending(true);
                    try {
                      await onPress?.();
                      onHide();
                    } catch (e: unknown) {
                      onError?.(e);
                    } finally {
                      setPending(false);
                    }
                  }}
                >
                  <Text subtitle2 color={colors.onBackground01} numberOfLines={1}>
                    {title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
      {children}
    </>
  );
};

const styles = createStyleSheet({
  container: {
    width: 280,
    borderRadius: 4,
  },
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

export default Dialogue;
