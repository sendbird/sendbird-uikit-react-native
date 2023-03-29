import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import type {
  SendbirdBaseChannel,
  SendbirdBaseMessage,
  SendbirdChatSDK,
  SendbirdGroupChannel,
} from '@sendbird/uikit-utils';
import { Logger, hash } from '@sendbird/uikit-utils';

import { GPT_MESSAGE_TYPE, GPT_USER_ID, GPT_USER_NAME } from '../constants';

export interface ChatGPTInterface {
  activated: boolean;
  prompt(message: string, context?: string[]): Promise<string>;
}

export interface ChatGPTUserInterface {
  focus(channel: SendbirdGroupChannel): Promise<void>;
  blur(): void;
}

export function chatGPTService(apiKey?: string): ChatGPTInterface {
  if (!apiKey) {
    return {
      activated: false,
      async prompt() {
        return 'openai api key required';
      },
    };
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };
  const fetcher = {
    get: (url: string) => {
      return fetch(url, { method: 'GET', headers }).then((res) => res.json());
    },
    post: (url: string, body: { [key: string]: unknown }) => {
      return fetch(url, { method: 'POST', headers, body: JSON.stringify(body) }).then((res) => res.json());
    },
  };

  const baseURL = 'https://api.openai.com/v1/completions';

  return {
    activated: true,
    async prompt(message: string, _context?: string[]): Promise<string> {
      let responseText = 'API request failure';

      try {
        const response = await fetcher.post(baseURL, {
          prompt: message,
          max_tokens: 512,
          temperature: 0.5,
          model: 'text-davinci-003',
        });
        responseText = response.choices?.[0]?.text.trim();
      } catch (e) {
        Logger.warn('ChatGPT request failure:', e);
      }

      return responseText;
    },
  };
}

export class ChatGPTUser implements ChatGPTUserInterface {
  public userId = GPT_USER_ID;
  public focusedChannelUrl?: string;

  constructor(public sdk: SendbirdChatSDK, public chatGPT: ChatGPTInterface) {
    if (!chatGPT.activated) return;

    this.sdk.connect(this.userId).then(async () => {
      await this.sdk.updateCurrentUserInfo({ nickname: GPT_USER_NAME });
      const channelId = hash(this.userId);
      const handler = new GroupChannelHandler({
        onMessageReceived: async (channel: SendbirdBaseChannel, message: SendbirdBaseMessage) => {
          if (
            channel.url === this.focusedChannelUrl &&
            channel.isGroupChannel() &&
            message.isUserMessage() &&
            message.customType !== GPT_MESSAGE_TYPE
          ) {
            channel.markAsRead().catch(() => void 0);
            channel.markAsDelivered().catch(() => void 0);
            await channel.startTyping().catch(() => void 0);
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
    if (!this.chatGPT.activated) return;

    this.sdk.groupChannel.removeAllGroupChannelHandlers();
  }

  async focus(channel: SendbirdGroupChannel) {
    if (!this.chatGPT.activated) return;

    if (!channel.isGroupChannel()) {
      throw new Error('Cannot enter, channel is not a group channel');
    }

    if (!channel.members.find((it) => it.userId === this.userId)) {
      throw new Error('ChatGPT Bot is not a member');
    }

    this.focusedChannelUrl = channel.url;
  }
  blur() {
    if (!this.chatGPT.activated) return;

    this.focusedChannelUrl = undefined;
  }
}
