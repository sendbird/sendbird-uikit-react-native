import { PubSubEvent, createPubSub } from '@sendbird/uikit-utils';

const defaultPubSub = createPubSub();

const useInternalPubSub = () => {
  return {
    events: PubSubEvent,
    subscribe: defaultPubSub.subscribe,
    publish: defaultPubSub.publish,
  };
};

export default useInternalPubSub;
