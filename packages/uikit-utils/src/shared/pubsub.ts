export type SubscribeListener = ((...args: unknown[]) => void) & { onError?: (error: unknown) => void };
export type SubscribeListenerPool = Record<symbol, SubscribeListener>;

export const createPubSub = (label = 'pubsub') => {
  const eventPool: Record<string, SubscribeListenerPool> = {};

  const getSubscribeListenerPool = (event: string) => {
    if (!eventPool[event]) eventPool[event] = {};
    return eventPool[event];
  };

  return {
    subscribe: (event: string, listener: SubscribeListener, subscriber = '') => {
      const name = `${label}_${event}_${subscriber}`;
      const id = Symbol(name);

      const subscribeListenerPool = getSubscribeListenerPool(event);
      subscribeListenerPool[id] = listener;

      return () => {
        delete getSubscribeListenerPool(event)[id];
      };
    },
    publish: (event: string, ...args: unknown[]) => {
      const subscribeListenerPool = getSubscribeListenerPool(event);
      const ids = Object.getOwnPropertySymbols(subscribeListenerPool);
      setTimeout(() => {
        ids.forEach((id) => {
          const listener = subscribeListenerPool[id];
          try {
            listener(...args);
          } catch (err: unknown) {
            if (listener.onError) {
              (err as Error).stack += `\npubsub error: ${id.description}`;
              listener.onError(err);
            }
          }
        });
      }, 0);
    },
  };
};
