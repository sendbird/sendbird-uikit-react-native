import type Sendbird from 'sendbird';

export enum PubSubEvent {
  ChannelUpdated,
  ChannelDeleted,
}

type EventParamsUnion =
  | {
      event: PubSubEvent.ChannelUpdated;
      params: {
        channel: Sendbird.GroupChannel | Sendbird.OpenChannel | Sendbird.BaseChannel;
      };
    }
  | {
      event: PubSubEvent.ChannelDeleted;
      params: {
        channelUrl: string;
      };
    };

type ExtractParams<E extends PubSubEvent, U extends EventParamsUnion> = U extends { event: E } ? U['params'] : never;
type EventParams<E extends PubSubEvent> = ExtractParams<E, EventParamsUnion>;
type EventListener<E extends PubSubEvent> = (params: EventParams<E>, err?: unknown) => void;

export const createPubSub = () => {
  const listeners: Record<PubSubEvent, Record<symbol, EventListener<PubSubEvent>>> = {
    [PubSubEvent.ChannelUpdated]: {},
    [PubSubEvent.ChannelDeleted]: {},
  };

  return {
    subscribe: <E extends PubSubEvent>(event: E, listener: EventListener<E>, subscriber = '') => {
      const name = `pubsub_${event}_${subscriber}`;
      const id = Symbol(name);

      const eventListenerPool = listeners[event] as unknown as Record<symbol, EventListener<E>>;
      eventListenerPool[id] = listener;

      return () => {
        delete listeners[event][id];
      };
    },
    publish: <E extends PubSubEvent = PubSubEvent>(event: E, params: EventParams<E>, publisher = '') => {
      const eventListenerPool = listeners[event];
      const ids = Object.getOwnPropertySymbols(eventListenerPool);
      ids.forEach((id) => {
        try {
          eventListenerPool[id](params);
        } catch (err: unknown) {
          (err as Error).stack += `\npubsub error: ${id.description}, ${publisher}`;
          eventListenerPool[id](null as unknown as EventParams<E>, err);
        }
      });
    },
  };
};
