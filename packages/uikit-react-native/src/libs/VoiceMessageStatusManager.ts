interface VoiceMessageStatus {
  currentTime: number;
}

class VoiceMessageStatusManager {
  private statusMap: Map<string, VoiceMessageStatus> = new Map();

  private generateKey(channelUrl: string, messageId: number): string {
    return `${channelUrl}-${messageId}`;
  }

  getCurrentTime(channelUrl: string, messageId: number): number {
    const key = this.generateKey(channelUrl, messageId);
    console.log(`useVoiceMessageStatus key:${key} currentTime: ${this.statusMap.get(key)?.currentTime}`);
    return this.statusMap.get(key)?.currentTime || 0;
  }

  setCurrentTime(channelUrl: string, messageId: number, currentTime: number): void {
    const key = this.generateKey(channelUrl, messageId);
    console.log(`useVoiceMessageStatus updateCurrentTime key:${key} currentTime: ${currentTime}`);
    if (!this.statusMap.has(key)) {
      this.statusMap.set(key, { currentTime });
    } else {
      this.statusMap.get(key)!.currentTime = currentTime;
    }
  }
}

export default VoiceMessageStatusManager;
