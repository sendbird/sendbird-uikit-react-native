import { truncate } from '../ui-format/common';

describe('ui-format/common', function () {
  test('truncate', function () {
    const testStr = '1234567890';
    const testMaxLen = 3;
    const testSeparator = '......';

    const str0 = truncate(testStr);
    expect(str0).toBe(testStr);

    const str1 = truncate(testStr, 100);
    expect(str1).toBe(testStr);

    const str2 = truncate(testStr, 6);
    expect(str2).toBe('123...890');

    const str3 = truncate(testStr, 7);
    expect(str3).toBe('1234...890');

    const str4 = truncate(testStr, 6, '???');
    expect(str4).toBe('123???890');

    const str5 = truncate(testStr, testMaxLen, testSeparator);
    expect(str5).toBe('12' + testSeparator + '0');
    expect(str5).toHaveLength(testMaxLen + testSeparator.length);
  });
});
