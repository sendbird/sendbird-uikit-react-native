import { isPromise } from '../index';

describe('isPromise', () => {
  it('should return true for a native promise', () => {
    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise(new Promise(() => void 0))).toBe(true);
    expect(isPromise((async () => void 0)())).toBe(true);
  });

  it('should return true for a promise that is not an instance of the current global Promise', () => {
    // Some environments replace `global.Promise` with a polyfill at startup (ex: for monitoring reasons),
    // so promises created by the engine's own implementation stop matching `instanceof Promise`.
    const foreignPromise = { then: () => void 0, catch: () => void 0 };
    expect(foreignPromise instanceof Promise).toBe(false);
    expect(isPromise(foreignPromise)).toBe(true);
  });

  it('should return false for values that cannot be awaited nor caught', () => {
    expect(isPromise(undefined)).toBe(false);
    expect(isPromise(null)).toBe(false);
    expect(isPromise(0)).toBe(false);
    expect(isPromise('')).toBe(false);
    expect(isPromise({})).toBe(false);
    expect(isPromise(() => void 0)).toBe(false);
    expect(isPromise({ then: () => void 0 })).toBe(false);
  });
});
