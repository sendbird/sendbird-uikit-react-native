interface VoiceMessageStatus {
  currentTime: number;
  subscribers?: Set<(currentTime: number) => void>;
}

class VoiceMessageStatusManager {
  private statusMap: Map<string, VoiceMessageStatus> = new Map();

  private generateKey = (channelUrl: string, messageId: number): string => {
    return `${channelUrl}-${messageId}`;
  };

  subscribe = (channelUrl: string, messageId: number, subscriber: (currentTime: number) => void) => {
    const key = this.generateKey(channelUrl, messageId);
    if (!this.statusMap.has(key)) {
      this.statusMap.set(key, { currentTime: 0, subscribers: new Set() });
    }
    this.statusMap.get(key)!.subscribers?.add(subscriber);
  };

  unsubscribe = (channelUrl: string, messageId: number, subscriber: (currentTime: number) => void) => {
    const key = this.generateKey(channelUrl, messageId);
    this.statusMap.get(key)?.subscribers?.delete(subscriber);
  };

  publishAll = (): void => {
    this.statusMap.forEach((status) => {
      status.subscribers?.forEach((subscriber) => {
        subscriber(status.currentTime);
      });
    });
  };

  getCurrentTime = (channelUrl: string, messageId: number): number => {
    const key = this.generateKey(channelUrl, messageId);
    return this.statusMap.get(key)?.currentTime || 0;
  };

  setCurrentTime = (channelUrl: string, messageId: number, currentTime: number): void => {
    const key = this.generateKey(channelUrl, messageId);
    if (!this.statusMap.has(key)) {
      this.statusMap.set(key, { currentTime });
    } else {
      this.statusMap.get(key)!.currentTime = currentTime;
    }
  };

  clear = (): void => {
    this.statusMap.forEach((status) => {
      status.subscribers?.clear();
    });
    this.statusMap.clear();
  };
}

export default VoiceMessageStatusManager;
