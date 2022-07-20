import createSelectByColorScheme from '../styles/createSelectByColorScheme';

describe('styles', function () {
  test('createSelectByColorScheme', function () {
    const select = createSelectByColorScheme('light');
    expect(typeof select).toBe('function');

    const selected1 = select({ light: 'light-value', dark: 'dark-value', default: 'default-value' });
    const selected2 = select({ light: undefined, dark: 'dark-value' });
    const selected3 = select({ light: undefined, dark: undefined, default: 'default-value' });

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
      select({ light: undefined });
    } catch (err) {
      expect(err).not.toBeUndefined();
    }

    try {
      select({ dark: undefined });
    } catch (err) {
      expect(err).not.toBeUndefined();
    }
  });
});
