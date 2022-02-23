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
type EventListener<E extends PubSubEvent> = (params: EventParams<E>) => void;

export const createPubSub = () => {
  const listeners: Record<PubSubEvent, Record<symbol, EventListener<PubSubEvent>>> = {
    [PubSubEvent.ChannelUpdated]: {},
    [PubSubEvent.ChannelDeleted]: {},
  };

  return {
    subscribe: <E extends PubSubEvent>(event: E, listener: EventListener<E>) => {
      const sym = Symbol();

      const eventListenerPool = listeners[event] as unknown as Record<symbol, EventListener<E>>;
      eventListenerPool[sym] = listener;

      return () => {
        delete listeners[event][sym];
      };
    },
    publish: <E extends PubSubEvent = PubSubEvent>(event: E, params: EventParams<E>) => {
      const eventListenerPool = listeners[event];
      const fns = Object.values(eventListenerPool) as EventListener<E>[];
      fns.forEach((fn) => fn(params));
    },
  };
};
