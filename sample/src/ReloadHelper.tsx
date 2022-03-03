import React, { useRef, useState } from 'react';
import { DevSettings, PanResponder, Pressable, Text, View } from 'react-native';

const ReloadHelper: React.FC<{ DEFAULT_VISIBLE?: boolean }> = ({ children, DEFAULT_VISIBLE = false }) => {
  const [visible, setVisible] = useState(DEFAULT_VISIBLE);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (_, { numberActiveTouches }) => numberActiveTouches >= 3,
      onPanResponderGrant: () => setVisible((p) => !p),
    }),
  ).current;

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
      {visible && (
        <Pressable
          onPress={() => DevSettings.reload()}
          style={{
            backgroundColor: 'rgba(255,113,17,0.6)',
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            height: 50,
            borderRadius: 25,
            position: 'absolute',
            bottom: '50%',
            right: 15,
          }}
        >
          <Text style={{ fontSize: 10, color: 'white' }}>{'RELOAD'}</Text>
        </Pressable>
      )}
    </View>
  );
};

export const withReload = (Component: () => JSX.Element, DEFAULT_VISIBLE?: boolean) =>
  function Reloadable(props: object) {
    if (__DEV__) {
      return (
        <ReloadHelper DEFAULT_VISIBLE={DEFAULT_VISIBLE}>
          <Component {...props} />
        </ReloadHelper>
      );
    }
    return <Component {...props} />;
  };

export default ReloadHelper;
