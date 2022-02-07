import type { AppearanceHelper, UIKitAppearance } from '../types';

/**
 * Appearance helper factory function
 * Return a function that returns a value matching with the current appearance among the input values.
 * @param appearance
 * @return AppearanceHelper
 * */
const createAppearanceHelper = (appearance: UIKitAppearance): AppearanceHelper => ({
  select(options) {
    const value = options[appearance ?? 'default'] ?? options['light'] ?? options['dark'] ?? options['default'];
    if (!value) throw Error('Not provided any selectable appearance values');
    return value;
  },
});

export default createAppearanceHelper;
