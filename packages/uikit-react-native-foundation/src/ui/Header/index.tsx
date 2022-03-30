import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, useWindowDimensions } from 'react-native';

import { conditionChaining } from '@sendbird/uikit-utils';

import type { BaseHeaderProps } from '../../index';
import createStyleSheet from '../../styles/createStyleSheet';
import getDefaultHeaderHeight from '../../styles/getDefaultHeaderHeight';
import useHeaderStyle from '../../styles/useHeaderStyle';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Text, { TextProps } from '../Text';

type HeaderElement = string | React.ReactElement | null;
type HeaderProps = BaseHeaderProps<
  {
    title?: HeaderElement;
    left?: HeaderElement;
    right?: HeaderElement;
    onPressLeft?: () => void;
    onPressRight?: () => void;
  },
  { clearTitleMargin?: boolean }
>;

const AlignMapper = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;
const Header: React.FC<HeaderProps> & {
  Button: typeof HeaderButton;
  Title: typeof HeaderTitle;
  SubTitle: typeof HeaderSubTitle;
} = ({
  children,
  titleAlign,
  title = null,
  left = null,
  right = null,
  onPressLeft,
  onPressRight,
  clearTitleMargin = false,
}) => {
  const { topInset, defaultTitleAlign } = useHeaderStyle();
  const { width, height } = useWindowDimensions();
  const { colors } = useUIKitTheme();

  const actualTitleAlign = titleAlign ?? defaultTitleAlign;

  if (!title && !left && !right) {
    return (
      <View style={{ paddingTop: topInset, backgroundColor: colors.ui.header.nav.none.background }}>{children}</View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: topInset,
          backgroundColor: colors.ui.header.nav.none.background,
          borderBottomColor: colors.ui.header.nav.none.borderBottom,
        },
      ]}
    >
      <View style={[styles.header, { height: getDefaultHeaderHeight(width > height) }]}>
        <LeftSide titleAlign={actualTitleAlign} left={left} onPressLeft={onPressLeft} />
        <View
          style={[
            styles.title,
            clearTitleMargin && { marginHorizontal: 0 },
            { justifyContent: AlignMapper[actualTitleAlign] },
          ]}
        >
          {typeof title === 'string' ? <HeaderTitle>{title}</HeaderTitle> : title}
        </View>
        <RightSide titleAlign={actualTitleAlign} right={right} onPressRight={onPressRight} />
      </View>
      {children}
    </View>
  );
};

const LeftSide: React.FC<HeaderProps> = ({ titleAlign, onPressLeft, left }) => {
  if (titleAlign === 'center') {
    return <View style={styles.left}>{left && <HeaderButton onPress={onPressLeft}>{left}</HeaderButton>}</View>;
  }
  if (!left) return null;
  return (
    <View style={styles.left}>
      <HeaderButton onPress={onPressLeft}>{left}</HeaderButton>
    </View>
  );
};

const RightSide: React.FC<HeaderProps> = ({ titleAlign, onPressRight, right }) => {
  if (titleAlign === 'center') {
    return <View style={styles.right}>{right && <HeaderButton onPress={onPressRight}>{right}</HeaderButton>}</View>;
  }
  if (!right) return null;
  return (
    <View style={styles.right}>
      <HeaderButton onPress={onPressRight}>{right}</HeaderButton>
    </View>
  );
};

const HeaderTitle: React.FC<{ children: string } & TextProps> = ({ children, style, ...props }) => {
  return (
    <Text {...props} h1 numberOfLines={1} style={style}>
      {children}
    </Text>
  );
};
const HeaderSubTitle: React.FC<{ children: string } & TextProps> = ({ children, style, ...props }) => {
  const { colors } = useUIKitTheme();
  return (
    <Text color={colors.onBackground03} {...props} caption2 numberOfLines={1} style={style}>
      {children}
    </Text>
  );
};
const HeaderButton: React.FC<TouchableOpacityProps & { color?: string }> = ({
  children,
  disabled,
  onPress,
  color,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      {...props}
      disabled={!onPress || disabled}
      onPress={(e) => onPress?.(e)}
      activeOpacity={0.7}
    >
      {conditionChaining(
        [typeof children === 'string' || typeof children === 'number'],
        [
          <Text button numberOfLines={1} color={color}>
            {children}
          </Text>,
          children,
        ],
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
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

Header.Button = HeaderButton;
Header.Title = HeaderTitle;
Header.SubTitle = HeaderSubTitle;
export default Header;
