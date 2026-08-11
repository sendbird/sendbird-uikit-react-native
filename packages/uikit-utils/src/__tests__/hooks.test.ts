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

  test('does nothing when the effect resolves without a destructor', async function () {
    const { unmount } = renderHook(() => useAsyncEffect(async () => undefined, []));

    expect(() => unmount()).not.toThrow();
  });

  test('awaits a promise that is not an instance of the current global Promise', async function () {
    // Some environments replace `global.Promise` with a polyfill at startup (ex: for monitoring reasons).
    // The hook should be permissived to them.
    class ForeignPromise<T> {
      constructor(private readonly value: T) {}
      then<R>(onFulfilled: (value: T) => R) {
        return Promise.resolve().then(() => onFulfilled(this.value));
      }
    }

    const destructor = jest.fn();
    const { unmount } = renderHook(() =>
      useAsyncEffect(() => new ForeignPromise(destructor) as unknown as Promise<() => void>, []),
    );

    expect(() => unmount()).not.toThrow();
    await waitFor(() => expect(destructor).toHaveBeenCalledTimes(1));
  });
});
