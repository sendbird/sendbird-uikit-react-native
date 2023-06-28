import { conditionChaining, hash, mergeObjectArrays, pick, replace } from '../../shared';

describe('hash', () => {
  it('should return the hash of a given string', () => {
    expect(hash('hello world')).toBe('1794106052');
    expect(hash('12345')).toBe('46792755');
    expect(hash('')).toBe('0');
  });
});

describe('replace', () => {
  it('should replace the specific range of text in the string with another text', () => {
    expect(replace('hello world', 0, 5, 'welcome')).toBe('welcome world');
    expect(replace('12345', 1, 4, '0')).toBe('105');
    expect(replace('abcde', 0, 0, 'x')).toBe('xabcde');
  });
});

describe('conditionChaining', () => {
  it('should return the value corresponding to the first true index of a given condition array', () => {
    expect(conditionChaining([false, false, true], ['a', 'b', 'c'])).toBe('c');
    expect(conditionChaining([true, false, false], [1, 2, 3])).toBe(1);
    expect(conditionChaining([false, false], [null, 'hello'])).toBe('hello');
    expect(conditionChaining([], [1, 2, 3])).toBe(3);
  });
});

describe('pick', () => {
  it('should return an object with only the specified keys', () => {
    const obj = { a: 1, b: '2', c: true } as const;
    const keys = ['a', 'c'] as Array<keyof typeof obj>;
    const result = pick(obj, keys);
    expect(result).toEqual({ a: 1, c: true });
  });

  it('should return an empty object if the input object is empty', () => {
    const obj = {} as const;
    const keys = ['a', 'c'] as Array<keyof typeof obj>;
    const result = pick(obj, keys);
    expect(result).toEqual({});
  });

  it('should return an empty object if the specified keys are empty', () => {
    const obj = { a: 1, b: '2', c: true } as const;
    const keys = [] as Array<keyof typeof obj>;
    const result = pick(obj, keys);
    expect(result).toEqual({});
  });

  it('should return an object with the specified key-value pairs if all keys are present', () => {
    const obj = { a: 1, b: '2', c: true } as const;
    const keys = ['a', 'b', 'c'] as Array<keyof typeof obj>;
    const result = pick(obj, keys);
    expect(result).toEqual(obj);
  });

  it('should return an object with only the keys that are present in the input object', () => {
    const obj = { a: 1, b: '2', c: true } as const;
    const keys = ['a', 'b', 'd'] as Array<keyof typeof obj>;
    const result = pick(obj, keys);
    expect(result).toEqual({ a: 1, b: '2' });
  });
});

describe('mergeObjectArrays', () => {
  interface Person {
    id: number;
    name: string;
  }

  test('should merge arrays and remove duplicates based on the specified key', () => {
    const A: Person[] = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ];

    const B: Person[] = [
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Tom' },
    ];

    const mergedArray = mergeObjectArrays(A, B, 'id');
    expect(mergedArray).toEqual([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Tom' },
    ]);

    expect(A).toEqual([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ]);
    expect(B).toEqual([
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Tom' },
    ]);
  });
});
