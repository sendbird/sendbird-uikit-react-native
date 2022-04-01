import { getStorybookUI } from '@storybook/react-native';
import type React from 'react';

import '../.storybook/storybook.requires';

/**
 *   RN Storybook 6.0 arg types
 *   text: TextType,
 *   number: NumberType,
 *   color: ColorType,
 *   boolean: BooleanType,
 *   object: ObjectType,
 *   select: SelectType,
 *   date: DateType,
 *   array: ArrayType,
 *   radio: RadioType,
 *   */

const StorybookUIRoot = getStorybookUI({}) as unknown as React.ComponentType;
export default StorybookUIRoot;
