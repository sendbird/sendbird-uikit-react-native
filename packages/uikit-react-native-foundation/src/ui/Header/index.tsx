import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, useWindowDimensions } from 'react-native';

import getDefaultHeaderHeight from '../../styles/getDefaultHeaderHeight';
import useHeaderStyle from '../../styles/useHeaderStyle';
import useUIKitTheme from '../../theme/useUIKitTheme';
import type { BaseHeaderProps } from '../../types';
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
const Header: React.FC<HeaderProps> = ({
  children,
  titleAlign = 'left',
  title = null,
  left = null,
  right = null,
  onPressLeft,
  onPressRight,
}) => {
  const { topInset } = useHeaderStyle();
  const { width, height } = useWindowDimensions();
  const { colors } = useUIKitTheme();

  if (!title && !left && !right) {
    return <View style={{ paddingTop: topInset, backgroundColor: colors.ui.header.background }} />;
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: topInset,
          backgroundColor: colors.ui.header.background,
          borderBottomColor: colors.ui.header.borderBottom,
        },
      ]}
    >
      <View style={[styles.header, { height: getDefaultHeaderHeight(width > height) }]}>
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
      {children}
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

const styles = createStyleSheet({
  container: {
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
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
