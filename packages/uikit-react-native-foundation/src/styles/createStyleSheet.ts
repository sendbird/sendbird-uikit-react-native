import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { DEFAULT_SCALE_FACTOR } from './createScaleFactor';

type Styles = ViewStyle | TextStyle | ImageStyle;
type StylePreprocessor<T extends Styles = Styles> = { [key in keyof T]: (val: NonNullable<T[key]>) => typeof val };

const SCALE_FACTOR_WITH_STR = (val: string | number) => (typeof val === 'string' ? val : DEFAULT_SCALE_FACTOR(val));

const preProcessor: Partial<StylePreprocessor> = {
  'fontSize': DEFAULT_SCALE_FACTOR,
  'lineHeight': DEFAULT_SCALE_FACTOR,
  'borderRadius': DEFAULT_SCALE_FACTOR,
  'minWidth': SCALE_FACTOR_WITH_STR,
  'maxWidth': SCALE_FACTOR_WITH_STR,
  'minHeight': SCALE_FACTOR_WITH_STR,
  'maxHeight': SCALE_FACTOR_WITH_STR,
  'height': SCALE_FACTOR_WITH_STR,
  'width': SCALE_FACTOR_WITH_STR,
  'padding': SCALE_FACTOR_WITH_STR,
  'paddingTop': SCALE_FACTOR_WITH_STR,
  'paddingBottom': SCALE_FACTOR_WITH_STR,
  'paddingLeft': SCALE_FACTOR_WITH_STR,
  'paddingRight': SCALE_FACTOR_WITH_STR,
  'margin': SCALE_FACTOR_WITH_STR,
  'marginTop': SCALE_FACTOR_WITH_STR,
  'marginBottom': SCALE_FACTOR_WITH_STR,
  'marginLeft': SCALE_FACTOR_WITH_STR,
  'marginRight': SCALE_FACTOR_WITH_STR,
  'left': SCALE_FACTOR_WITH_STR,
  'right': SCALE_FACTOR_WITH_STR,
  'top': SCALE_FACTOR_WITH_STR,
  'bottom': SCALE_FACTOR_WITH_STR,
};

const preProcessorKeys = Object.keys(preProcessor);
const preProcessorLen = preProcessorKeys.length;

/**
 * Create StyleSheet with customized pre-processor
 * Return a StyleSheet that pre-processed
 * @param styles
 * @returns StyleSheet
 * */
const createStyleSheet = <T extends StyleSheet.NamedStyles<T>>(styles: T | StyleSheet.NamedStyles<T>): T => {
  Object.values(styles).forEach((style) => {
    // @ts-ignore
    const styleKeys = Object.keys(style);
    const styleLen = styleKeys.length;

    const keys = styleLen < preProcessorLen ? styleKeys : preProcessorKeys;
    keys.forEach((key) => {
      // @ts-ignore
      if (preProcessor[key] && typeof style[key] !== 'undefined') style[key] = preProcessor[key](style[key]);
    });
  });

  return StyleSheet.create<T>(styles);
};

export default createStyleSheet;
