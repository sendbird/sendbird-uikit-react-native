import createAppearanceHelper from '../utils/appearanceHelper';

test('createAppearanceHelper', function () {
  const helper = createAppearanceHelper('light');
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
    helper.select({ light: undefined });
  } catch (err) {
    expect(err).not.toBeUndefined();
  }

  try {
    helper.select({ dark: undefined });
  } catch (err) {
    expect(err).not.toBeUndefined();
  }
});
