import type { AppearanceHelper, UIKitAppearance } from '../types';

const appearanceHelperFactory = (appearance: UIKitAppearance): AppearanceHelper => ({
  select(options) {
    const value = options[appearance ?? 'default'] ?? options['light'] ?? options['dark'];
    if (!value) throw Error('Not provided any selectable appearance values');
    return value;
  },
});

export default appearanceHelperFactory;
