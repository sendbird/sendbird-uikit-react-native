import type { UIKitAppearance, UIKitTheme } from '../types';

/**
 * Appearance helper factory function
 * Return a function that returns a value matching with the current appearance among the input values.
 * @param appearance
 * @returns Function
 * */
const createAppearanceHelper = <Appearance extends string>(
  appearance: UIKitAppearance<Appearance>,
): UIKitTheme<Appearance>['select'] => {
  return (options) => {
    const value = options[appearance ?? 'default'] ?? options['light'] ?? options['dark'] ?? options['default'];
    if (!value) throw Error('Not provided any selectable appearance values');
    return value;
  };
};

export default createAppearanceHelper;
