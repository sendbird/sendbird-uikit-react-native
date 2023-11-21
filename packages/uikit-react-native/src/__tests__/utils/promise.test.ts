import { PromisePolyfill } from '../../utils/promise';

describe('PromisePolyfill', () => {
  describe('allSettled', () => {
    it('primitive', async () => {
      const data = [1, NaN, '3', false, true, null, undefined, Symbol('symbol')];

      const expected = await Promise.allSettled(data);
      const received = await PromisePolyfill.allSettled(data);

      expect(expected).toEqual(received);
    });

    it('object', async () => {
      const data = [
        { 1: 1 },
        { then: 'then' },
        [],
        [1, 2, 3],
        new Date(),
        function named() {},
        () => {},
        Promise.resolve(() => {}),
        Promise.reject(function () {}),
      ];

      const expected = await Promise.allSettled(data);
      const received = await PromisePolyfill.allSettled(data);

      expect(expected).toEqual(received);
    });

    it('promise', async () => {
      const data = [Promise.resolve([1, 2, 3]), Promise.reject([4, 5, 6]), [7, 8, 9]];

      const expected = await Promise.allSettled(data);
      const received = await PromisePolyfill.allSettled(data);

      expect(expected).toEqual(received);
    });
  });

  describe('apply', () => {
    it('should not equal native Promise.allSettled', () => {
      expect(Promise.allSettled).not.toBe(PromisePolyfill.allSettled);
    });

    it('should not affect native Promise.allSettled if already defined', () => {
      expect(Promise.allSettled).not.toBeUndefined();

      PromisePolyfill.apply();
      expect(Promise.allSettled).not.toBe(PromisePolyfill.allSettled);
    });

    it('should apply the polyfill to native Promise.allSettled if not defined', () => {
      // @ts-expect-error
      Promise.allSettled = undefined;

      PromisePolyfill.apply();
      expect(Promise.allSettled).toBe(PromisePolyfill.allSettled);
    });
  });
});
