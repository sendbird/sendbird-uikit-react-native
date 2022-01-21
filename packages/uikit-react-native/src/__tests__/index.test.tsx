import appearanceHelperFactory from '../utils/appearanceHelper';

describe('utils', function () {
  it('appearanceHelperFactory', function () {
    const helper = appearanceHelperFactory('light');
    expect(typeof helper['select']).toBe('function');

    const selected1 = helper.select({ light: 'light-value', dark: 'dark-value', default: 'default-value' });
    const selected2 = helper.select({ light: undefined, dark: 'dark-value' });
    const selected3 = helper.select({ light: undefined, dark: undefined, default: 'default-value' });

    expect(selected1).toBe('light-value');
    expect(selected1).not.toBe('dark-value');
    expect(selected1).not.toBe('default-value');

    expect(selected2).toBe('dark-value');
    expect(selected2).not.toBeUndefined();
    expect(selected2).not.toBe('light-value');

    expect(selected3).toBe('default-value');
    expect(selected3).not.toBeUndefined();
    expect(selected3).not.toBe('light-value');

    try {
      helper.select({});
    } catch (err) {
      expect(err).not.toBeUndefined();
    }
  });
});
