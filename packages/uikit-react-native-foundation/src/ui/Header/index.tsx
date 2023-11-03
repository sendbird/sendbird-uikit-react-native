import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { conditionChaining } from '@sendbird/uikit-utils';

import Text, { TextProps } from '../../components/Text';
import type { BaseHeaderProps, HeaderElement } from '../../index';
import createStyleSheet from '../../styles/createStyleSheet';
import useHeaderStyle from '../../styles/useHeaderStyle';
import useUIKitTheme from '../../theme/useUIKitTheme';

export type HeaderProps = BaseHeaderProps<
  {
    title?: HeaderElement;
    left?: HeaderElement;
    right?: HeaderElement;
    onPressLeft?: () => void;
    onPressRight?: () => void;
  },
  {
    clearTitleMargin?: boolean;
    clearStatusBarTopInset?: boolean;
    statusBarTopInsetAs?: 'padding' | 'margin';
  }
>;

const AlignMapper = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;
const Header = ({
  children,
  titleAlign,
  title = null,
  left = null,
  right = null,
  onPressLeft,
  onPressRight,
  clearTitleMargin = false,
  clearStatusBarTopInset = false,
  statusBarTopInsetAs = 'padding',
}: HeaderProps) => {
  const { topInset, defaultTitleAlign, defaultHeight } = useHeaderStyle();

  const { colors } = useUIKitTheme();
  const { left: paddingLeft, right: paddingRight } = useSafeAreaInsets();

  const actualTitleAlign = titleAlign ?? defaultTitleAlign;
  const actualTopInset = clearStatusBarTopInset ? 0 : topInset;

  if (!title && !left && !right) {
    return (
      <View style={{ paddingTop: actualTopInset, backgroundColor: colors.ui.header.nav.none.background }}>
        {children}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          [statusBarTopInsetAs === 'padding' ? 'paddingTop' : 'marginTop']: actualTopInset,
          paddingLeft: paddingLeft + styles.container.paddingHorizontal,
          paddingRight: paddingRight + styles.container.paddingHorizontal,
          backgroundColor: colors.ui.header.nav.none.background,
          borderBottomColor: colors.ui.header.nav.none.borderBottom,
        },
      ]}
    >
      <View style={[styles.header, { height: defaultHeight }]}>
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

const LeftSide = ({ titleAlign, onPressLeft, left }: HeaderProps) => {
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

const RightSide = ({ titleAlign, onPressRight, right }: HeaderProps) => {
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

const HeaderTitle = ({ children, style, ...props }: TextProps) => {
  return (
    <Text {...props} h1 numberOfLines={1} style={style}>
      {children}
    </Text>
  );
};
const HeaderSubtitle = ({ children, style, ...props }: TextProps) => {
  const { colors } = useUIKitTheme();
  return (
    <Text color={colors.onBackground03} {...props} caption2 numberOfLines={1} style={style}>
      {children}
    </Text>
  );
};
const HeaderButton = ({ children, disabled, onPress, color, ...props }: TouchableOpacityProps & { color?: string }) => {
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

export default Object.assign(Header, {
  Button: HeaderButton,
  Title: HeaderTitle,
  Subtitle: HeaderSubtitle,
});
