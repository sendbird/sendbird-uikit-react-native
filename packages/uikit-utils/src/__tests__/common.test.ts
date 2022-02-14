import { truncate } from '../ui-format/common';

describe('ui-format/common', function () {
  const testStr = '1234567890';
  const testMaxLen = 3;
  const testSeparator = '......';

  test('truncate/mid', function () {
    const str0 = truncate(testStr);
    expect(str0).toBe(testStr);

    const str1 = truncate(testStr, { maxLen: 100 });
    expect(str1).toBe(testStr);

    const str2 = truncate(testStr, { maxLen: 6 });
    expect(str2).toBe('123...890');

    const str3 = truncate(testStr, { maxLen: 7 });
    expect(str3).toBe('1234...890');

    const str4 = truncate(testStr, { maxLen: 6, separator: '???' });
    expect(str4).toBe('123???890');

    const str5 = truncate(testStr, { maxLen: testMaxLen, separator: testSeparator });
    expect(str5).toBe('12' + testSeparator + '0');
    expect(str5).toHaveLength(testMaxLen + testSeparator.length);
  });

  test('truncate/head', function () {
    const str0 = truncate(testStr, { mode: 'head' });
    expect(str0).toBe(testStr);

    const str1 = truncate(testStr, { maxLen: 100, mode: 'head' });
    expect(str1).toBe(testStr);

    const str2 = truncate(testStr, { maxLen: 6, mode: 'head' });
    expect(str2).toBe('...567890');

    const str3 = truncate(testStr, { maxLen: 7, mode: 'head' });
    expect(str3).toBe('...4567890');

    const str4 = truncate(testStr, { maxLen: 6, separator: '???', mode: 'head' });
    expect(str4).toBe('???567890');

    const str5 = truncate(testStr, { maxLen: testMaxLen, separator: testSeparator, mode: 'head' });
    expect(str5).toBe(testSeparator + '890');
    expect(str5).toHaveLength(testMaxLen + testSeparator.length);
  });

  test('truncate/tail', function () {
    const str0 = truncate(testStr, { mode: 'tail' });
    expect(str0).toBe(testStr);

    const str1 = truncate(testStr, { maxLen: 100, mode: 'tail' });
    expect(str1).toBe(testStr);

    const str2 = truncate(testStr, { maxLen: 6, mode: 'tail' });
    expect(str2).toBe('123456...');

    const str3 = truncate(testStr, { maxLen: 7, mode: 'tail' });
    expect(str3).toBe('1234567...');

    const str4 = truncate(testStr, { maxLen: 6, separator: '???', mode: 'tail' });
    expect(str4).toBe('123456???');

    const str5 = truncate(testStr, { maxLen: testMaxLen, separator: testSeparator, mode: 'tail' });
    expect(str5).toBe('123' + testSeparator);
    expect(str5).toHaveLength(testMaxLen + testSeparator.length);
  });
});
