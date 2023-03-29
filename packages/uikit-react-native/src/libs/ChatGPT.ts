import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import type {
  SendbirdBaseChannel,
  SendbirdBaseMessage,
  SendbirdChatSDK,
  SendbirdGroupChannel,
} from '@sendbird/uikit-utils';
import { hash } from '@sendbird/uikit-utils';

import { GPT_USER_ID } from '../constants';

export interface ChatGPTInterface {
  prompt(message: string, context?: string[]): Promise<string>;
}

export interface ChatGPTUserInterface {
  focus(channel: SendbirdGroupChannel): Promise<void>;
  blur(): void;
}

export function chatGPTService(_apiKey: string): ChatGPTInterface {
  // const headers = { 'Api-Key': apiKey };
  // const fetcher = {
  //   get: (url: string) => {
  //     return fetch(url, { method: 'GET', headers }).then((res) => res.json());
  //   },
  //   post: (url: string, body: { [key: string]: unknown }) => {
  //     return fetch(url, { method: 'GET', headers, body: JSON.stringify(body) }).then((res) => res.json());
  //   },
  // };

  return {
    prompt(_message: string, _context?: string[]): Promise<string> {
      // Interact with api or sdk
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('API 준비중입니다.');
        }, 3000);
      });
    },
  };
}

export class ChatGPTUser implements ChatGPTUserInterface {
  public userId = GPT_USER_ID;
  public focusedChannelUrl?: string;

  constructor(public sdk: SendbirdChatSDK, public chatGPT: ChatGPTInterface) {
    this.sdk.connect(this.userId).then(() => {
      const channelId = hash(this.userId);
      const handler = new GroupChannelHandler({
        onMessageReceived: async (channel: SendbirdBaseChannel, message: SendbirdBaseMessage) => {
          if (channel.url === this.focusedChannelUrl && channel.isGroupChannel() && message.isUserMessage()) {
            await channel.startTyping();
            try {
              const response = await this.chatGPT.prompt(message.message);
              await channel.sendUserMessage({ message: response });
            } finally {
              await channel.endTyping();
            }
          }
        },
      });

      this.sdk.groupChannel.addGroupChannelHandler(channelId, handler);
    });
  }

  deinit() {
    this.sdk.groupChannel.removeAllGroupChannelHandlers();
  }

  async focus(channel: SendbirdGroupChannel) {
    if (channel.isGroupChannel()) {
      this.focusedChannelUrl = channel.url;
    } else {
      throw new Error('Cannot enter, channel is not a group channel');
    }
  }
  blur() {
    this.focusedChannelUrl = undefined;
  }
}
