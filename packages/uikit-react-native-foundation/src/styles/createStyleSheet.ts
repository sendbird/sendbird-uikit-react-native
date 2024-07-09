import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { AnimatableNumericValue, DimensionValue } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import { DEFAULT_SCALE_FACTOR } from './createScaleFactor';

type Styles = ViewStyle | TextStyle | ImageStyle;
type StylePreprocessor<T extends Styles = Styles> = { [key in keyof T]: (val: NonNullable<T[key]>) => typeof val };

const SCALE_FACTOR_WITH_DIMENSION_VALUE = (
  val: NonNullable<DimensionValue | undefined>,
): NonNullable<DimensionValue | undefined> => {
  return typeof val === 'number' ? DEFAULT_SCALE_FACTOR(val) : val;
};

const DEFAULT_SCALE_FACTOR_WITH_NUMERIC_VALUE = (
  val: NonNullable<AnimatableNumericValue | undefined>,
): NonNullable<AnimatableNumericValue | undefined> => {
  return typeof val === 'number' ? DEFAULT_SCALE_FACTOR(val) : val;
};

const preProcessor: Partial<StylePreprocessor> = {
  'fontSize': DEFAULT_SCALE_FACTOR,
  'lineHeight': DEFAULT_SCALE_FACTOR,
  'borderRadius': DEFAULT_SCALE_FACTOR_WITH_NUMERIC_VALUE,
  'minWidth': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'maxWidth': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'minHeight': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'maxHeight': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'height': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'width': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'padding': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'paddingVertical': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'paddingHorizontal': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'paddingTop': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'paddingBottom': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'paddingLeft': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'paddingRight': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'margin': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'marginVertical': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'marginHorizontal': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'marginTop': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'marginBottom': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'marginLeft': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'marginRight': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'left': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'right': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'top': SCALE_FACTOR_WITH_DIMENSION_VALUE,
  'bottom': SCALE_FACTOR_WITH_DIMENSION_VALUE,
};

const preProcessorKeys = Object.keys(preProcessor);
const preProcessorLen = preProcessorKeys.length;

/**
 * Create StyleSheet with customized pre-processor
 * Return a StyleSheet that pre-processed
 * @param styles
 * @returns StyleSheet
 * */
/* eslint-disable @typescript-eslint/no-explicit-any */
const createStyleSheet = <T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  styles: T & StyleSheet.NamedStyles<any>,
): T => {
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
/* eslint-enable @typescript-eslint/no-explicit-any */

export default createStyleSheet;
