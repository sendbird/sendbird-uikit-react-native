import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BaseHeaderProps } from '@sendbird/uikit-react-native-core';

import getDefaultHeaderHeight from '../../styles/getDefaultHeaderHeight';
import useHeaderStyle from '../../styles/useHeaderStyle';
import useUIKitTheme from '../../theme/useUIKitTheme';
import createStyleSheet from '../../utils/createStyleSheet';
import Text from '../Text';

type HeaderElement = string | React.ReactElement | null;
type HeaderProps = BaseHeaderProps<{
  title?: HeaderElement;
  left?: HeaderElement;
  right?: HeaderElement;
  onPressLeft?: () => void;
  onPressRight?: () => void;
}>;

const AlignMapper = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;
const Header: React.FC<HeaderProps> & { Button: typeof HeaderButton } = ({
  titleAlign = 'left',
  title = null,
  left = null,
  right = null,
  onPressLeft,
  onPressRight,
}) => {
  const { statusBarTranslucent } = useHeaderStyle();
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const { colors } = useUIKitTheme();

  const TOP_INSET = statusBarTranslucent ? top : 0;

  if (!title && !left && !right) {
    return <View style={{ paddingTop: TOP_INSET, backgroundColor: colors.background }} />;
  }

  return (
    <View
      style={[
        styles.container,
        {
          height: getDefaultHeaderHeight(width > height) + TOP_INSET,
          paddingTop: TOP_INSET,
          backgroundColor: colors.background,
          borderBottomColor: colors.onBackground04,
        },
      ]}
    >
      {left && (
        <View style={styles.left}>
          <HeaderButton onPress={onPressLeft}>{left}</HeaderButton>
        </View>
      )}
      <View style={[styles.title, { alignItems: AlignMapper[titleAlign] }]}>
        {typeof title === 'string' ? <Text h1>{title}</Text> : { title }}
      </View>
      {right && (
        <View style={styles.right}>
          <HeaderButton onPress={onPressRight}>{right}</HeaderButton>
        </View>
      )}
    </View>
  );
};

const HeaderButton: React.FC<TouchableOpacityProps> = ({ children, disabled, onPress, ...props }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      {...props}
      disabled={!onPress || disabled}
      onPress={(e) => onPress?.(e)}
      activeOpacity={0.7}
    >
      {(typeof children).match(/string|number/) ? <Text button>{children}</Text> : children}
    </TouchableOpacity>
  );
};

Header.Button = HeaderButton;

const styles = createStyleSheet({
  container: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  title: {
    flex: 1,
    marginHorizontal: 12,
    justifyContent: 'center',
  },
  left: {
    height: '100%',
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  right: {
    height: '100%',
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  button: {
    padding: 4,
  },
});

export default Header;
