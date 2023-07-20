export type PubSub<T> = {
  publish: (data: T) => void;
  subscribe: (subscriber: (data: T) => void) => () => void;
};

const pubsub = <T>(): PubSub<T> => {
  const subscribers = new Set<Function>();

  return {
    publish: (data: unknown) => {
      subscribers.forEach((subscriber) => {
        setTimeout(() => subscriber(data), 0);
      });
    },
    subscribe: (subscriber: Function) => {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
  };
};

export default pubsub;
