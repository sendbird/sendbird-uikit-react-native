import type { UIKitColorScheme, UIKitTheme } from '../types';

/**
 * select method factory
 * Select method returns the most fitting value for the color scheme you are currently running on.
 * @param colorScheme
 * @returns Function
 * */
const createSelectByColorScheme = (colorScheme: UIKitColorScheme): UIKitTheme['select'] => {
  return (options) => {
    const value = options[colorScheme ?? 'default'] ?? options['light'] ?? options['dark'] ?? options['default'];
    if (!value) throw Error('Not provided any selectable color scheme values');
    return value;
  };
};

export default createSelectByColorScheme;
