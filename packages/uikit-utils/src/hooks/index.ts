/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DependencyList } from 'react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

type Destructor = () => void;
type AsyncEffectCallback = () => void | Destructor | Promise<void> | Promise<Destructor>;

const idPool: { [key: string]: number } = {};
export const useUniqId = (key: string) => {
  return useState(() => {
    if (!idPool[key]) idPool[key] = 1;
    return idPool[key]++;
  })[0];
};

export const useForceUpdate = () => {
  const [, updater] = useState(0);
  return useCallback(() => updater((prev) => prev + 1), []);
};

export const useAsyncEffect = (asyncEffect: AsyncEffectCallback, deps?: DependencyList) => {
  useEffect(createAsyncEffectCallback(asyncEffect), deps);
};
export const useAsyncLayoutEffect = (asyncEffect: AsyncEffectCallback, deps?: DependencyList) => {
  useLayoutEffect(createAsyncEffectCallback(asyncEffect), deps);
};
export const useIIFE = <T>(callback: () => T) => {
  return iife(callback);
};
const iife = <T extends (...args: any[]) => any>(callback: T): ReturnType<T> => callback();
const createAsyncEffectCallback = (asyncEffect: AsyncEffectCallback) => () => {
  const destructor = iife(asyncEffect);
  return () => {
    if (!destructor) return;

    if (destructor instanceof Promise) {
      iife(async () => {
        const awaitedDestructor = await destructor;
        if (awaitedDestructor) awaitedDestructor();
      });
    } else {
      iife(destructor);
    }
  };
};

export const useIsMountedRef = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};

export const useIsFirstMount = () => {
  const isFirstMount = useRef(true);

  if (isFirstMount.current) {
    isFirstMount.current = false;
    return true;
  }

  return isFirstMount.current;
};

export const useFreshCallback = <T extends (...args: any[]) => any>(callback: T): T => {
  const ref = useRef<T>(callback);
  ref.current = callback;
  return useCallback(((...args) => ref.current(...args)) as T, []);
};

type EdgePaddingMap = {
  left: 'paddingLeft';
  right: 'paddingRight';
  top: 'paddingTop';
  bottom: 'paddingBottom';
};
const edgePaddingMap: EdgePaddingMap = {
  left: 'paddingLeft',
  right: 'paddingRight',
  top: 'paddingTop',
  bottom: 'paddingBottom',
};
export const useSafeAreaPadding = <
  T extends keyof EdgeInsets,
  Result extends { [key in EdgePaddingMap[T]]: EdgeInsets[T] },
>(
  edges: T[],
): Result => {
  const safeAreaInsets = useSafeAreaInsets();
  return useMemo(() => {
    return edges.reduce((map, edge) => {
      const paddingKey = edgePaddingMap[edge];
      map[paddingKey] = safeAreaInsets[edge];
      return map;
    }, {} as { [key in EdgePaddingMap[T]]: EdgeInsets[T] });
  }, edges) as Result;
};
