export enum OpenChannelCustomType {
  LIVE = 'SB_LIVE_TYPE',
  COMMUNITY = 'SB_COMMUNITY_TYPE',
}

export function parseStreamData(data: string) {
  try {
    return JSON.parse(data) as {
      creator_info: { id: string; name: string; profile_url: string };
      live_channel_url: string;
      name: string;
      tags: string[];
      thumbnail_url: string;
    };
  } catch {
    return null;
  }
}
