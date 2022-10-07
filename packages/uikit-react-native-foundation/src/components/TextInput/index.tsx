import React from 'react';
import { TextInput as RNTextInput, TextInputProps } from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import type { UIKitTheme } from '../../types';

type Props = { variant?: keyof UIKitTheme['colors']['ui']['input'] } & TextInputProps;
const TextInput = React.forwardRef<RNTextInput, Props>(function TextInput(
  { children, style, variant = 'default', editable = true, ...props },
  ref,
) {
  const { typography, colors } = useUIKitTheme();

  const variantStyle = colors['ui']['input'][variant];
  const inputStyle = editable ? variantStyle.active : variantStyle.disabled;
  const underlineStyle = variant === 'underline' && { borderBottomWidth: 2, borderBottomColor: inputStyle.highlight };

  return (
    <RNTextInput
      ref={ref}
      editable={editable}
      selectionColor={inputStyle.highlight}
      placeholderTextColor={inputStyle.placeholder}
      style={[
        typography.body3,
        styles.input,
        { color: inputStyle.text, backgroundColor: inputStyle.background },
        underlineStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </RNTextInput>
  );
});

const styles = createStyleSheet({
  input: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default TextInput;
