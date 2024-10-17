import React from 'react';
import { I18nManager, TextInput as RNTextInput, StyleSheet, TextInputProps, TextStyle } from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import type { UIKitTheme } from '../../types';
import { RTLTextAlignSupportProps } from '../Text';
import { isStartsWithRTL } from '../Text/isStartsWithRTL';

type Props = {
  variant?: keyof UIKitTheme['colors']['ui']['input'];
} & TextInputProps &
  RTLTextAlignSupportProps;
const TextInput = React.forwardRef<RNTextInput, Props>(function TextInput(
  { children, style, variant = 'default', editable = true, originalText, supportRTLAlign, ...props },
  ref,
) {
  const { typography, colors } = useUIKitTheme();

  const variantStyle = colors['ui']['input'][variant];
  const inputStyle = editable ? variantStyle.active : variantStyle.disabled;
  const underlineStyle = variant === 'underline' && { borderBottomWidth: 2, borderBottomColor: inputStyle.highlight };
  const fontStyle = {
    ...typography.body3,
    lineHeight: typography.body3.fontSize ? typography.body3.fontSize * 1.2 : undefined,
  };

  const textStyle = StyleSheet.flatten([
    fontStyle,
    styles.input,
    { color: inputStyle.text, backgroundColor: inputStyle.background },
    underlineStyle,
    style,
  ]) as TextStyle;

  const textAlign = (() => {
    if (I18nManager.isRTL && supportRTLAlign) {
      // Note: TextInput is not affected by doLeftAndRightSwapInRTL
      if (originalText) {
        return isStartsWithRTL(originalText) ? 'right' : 'left';
      } else if (props.placeholder) {
        return isStartsWithRTL(props.placeholder) ? 'right' : 'left';
      }
    }

    return textStyle.textAlign;
  })();

  return (
    <RNTextInput
      ref={ref}
      editable={editable}
      selectionColor={inputStyle.highlight}
      placeholderTextColor={inputStyle.placeholder}
      style={[textStyle, { textAlign }]}
      {...props}
    >
      {children}
    </RNTextInput>
  );
});

const styles = createStyleSheet({
  input: {
    includeFontPadding: false,
    paddingTop: 8,
    paddingBottom: 8,
    paddingStart: 16,
    paddingEnd: 16,
  },
});

export default TextInput;
