import { renderHook, waitFor } from '@testing-library/react-native';

import { useAsyncEffect } from '../hooks';

describe('hooks/useAsyncEffect', function () {
  test('calls a synchronous destructor on unmount', function () {
    const destructor = jest.fn();
    const { unmount } = renderHook(() => useAsyncEffect(() => destructor, []));

    expect(destructor).not.toHaveBeenCalled();
    unmount();
    expect(destructor).toHaveBeenCalledTimes(1);
  });

  test('awaits an asynchronous destructor on unmount', async function () {
    const destructor = jest.fn();
    const { unmount } = renderHook(() => useAsyncEffect(async () => destructor, []));

    unmount();
    await waitFor(() => expect(destructor).toHaveBeenCalledTimes(1));
  });

  test('does nothing when the effect resolves without a destructor', function () {
    const { unmount } = renderHook(() => useAsyncEffect(async () => undefined, []));

    expect(() => unmount()).not.toThrow();
  });

  describe('when global.Promise is replaced after the effect promise was created', function () {
    const NativePromise = Promise;

    beforeEach(() => {
      // An APM agent or a polyfill swapping `global.Promise` at startup.
      global.Promise = class ReplacedPromise<T> extends NativePromise<T> {} as PromiseConstructor;
    });
    afterEach(() => {
      global.Promise = NativePromise;
    });

    test('does not throw and still awaits the destructor', async function () {
      const destructor = jest.fn();
      const foreign = NativePromise.resolve(destructor);
      expect(foreign instanceof Promise).toBe(false);

      const { unmount } = renderHook(() => useAsyncEffect(() => foreign, []));

      expect(() => unmount()).not.toThrow();
      await waitFor(() => expect(destructor).toHaveBeenCalledTimes(1));
    });

    test('does not throw when the effect resolves without a destructor', function () {
      const foreign = NativePromise.resolve(undefined);
      const { unmount } = renderHook(() => useAsyncEffect(() => foreign, []));

      expect(() => unmount()).not.toThrow();
    });
  });
});
