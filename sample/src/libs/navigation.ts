import { Route, StackActions, createNavigationContainerRef } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { GroupChannelType } from '@sendbird/uikit-react-native';
import type { SendbirdChatSDK } from '@sendbird/uikit-utils';

import { GetSendbirdSDK } from '../factory';
import { authManager } from './authentication';

export enum Routes {
  SignIn = 'SignIn',
  Home = 'Home',

  Storybook = 'Storybook',
  Palette = 'Palette',
  ThemeColors = 'ThemeColors',

  OpenChannelTabs = 'OpenChannelTabs',
  OpenChannelListCommunity = 'OpenChannelListCommunity',
  OpenChannelListLiveStreams = 'OpenChannelListLiveStreams',
  OpenChannel = 'OpenChannel',
  OpenChannelLiveStream = 'OpenChannelLiveStream',
  OpenChannelSettings = 'OpenChannelSettings',
  OpenChannelParticipants = 'OpenChannelParticipants',
  OpenChannelCreate = 'OpenChannelCreate',
  OpenChannelModeration = 'OpenChannelModeration',
  OpenChannelMutedParticipants = 'OpenChannelMutedParticipants',
  OpenChannelBannedUsers = 'OpenChannelBannedUsers',
  OpenChannelOperators = 'OpenChannelOperators',
  OpenChannelRegisterOperator = 'OpenChannelRegisterOperator',

  GroupChannelTabs = 'GroupChannelTabs',
  GroupChannelList = 'GroupChannelList',
  GroupChannel = 'GroupChannel',
  GroupChannelSettings = 'GroupChannelSettings',
  GroupChannelNotifications = 'GroupChannelNotifications',
  GroupChannelMembers = 'GroupChannelMembers',
  GroupChannelModeration = 'GroupChannelModeration',
  GroupChannelOperators = 'GroupChannelOperators',
  GroupChannelRegisterOperator = 'GroupChannelRegisterOperator',
  GroupChannelMutedMembers = 'GroupChannelMutedMembers',
  GroupChannelBannedUsers = 'GroupChannelBannedUsers',
  GroupChannelThread = 'GroupChannelThread',

  GroupChannelCreate = 'GroupChannelCreate',
  GroupChannelInvite = 'GroupChannelInvite',
  Settings = 'Settings',
  FileViewer = 'FileViewer',
  MessageSearch = 'MessageSearch',
}

type ChannelUrlParams = {
  channelUrl: string;
};

export type RouteParamsUnion =
  /** Shared screens **/
  | {
      route: Routes.SignIn;
      params: undefined;
    }
  | {
      route: Routes.Home;
      params: undefined;
    }
  | {
      route: Routes.Storybook;
      params: undefined;
    }
  | {
      route: Routes.Palette;
      params: undefined;
    }
  | {
      route: Routes.ThemeColors;
      params: undefined;
    }
  | {
      route: Routes.Settings;
      params: undefined;
    }
  | {
      route: Routes.FileViewer;
      params: {
        serializedFileMessage: object;
        deleteMessage: () => Promise<void>;
      };
    }
  /** GroupChannel screens **/
  | {
      route: Routes.GroupChannelTabs;
      params: Partial<ChannelUrlParams> | undefined;
    }
  | {
      route: Routes.GroupChannelList;
      params: Partial<ChannelUrlParams> | undefined;
    }
  | {
      route: Routes.GroupChannelCreate;
      params: { channelType: GroupChannelType };
    }
  | {
      route: Routes.GroupChannel;
      params: {
        channelUrl: string;
        searchItem?: { startingPoint: number };
      };
    }
  | {
      route: Routes.GroupChannelSettings;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.GroupChannelNotifications;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.GroupChannelMembers;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.GroupChannelModeration;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.GroupChannelOperators;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.GroupChannelRegisterOperator;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.GroupChannelMutedMembers;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.GroupChannelBannedUsers;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.GroupChannelInvite;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.MessageSearch;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.GroupChannelThread;
      params: {
        channelUrl: string;
        serializedMessage: object;
        startingPoint?: number;
      };
    }
  /** OpenChannel screens **/
  | {
      route: Routes.OpenChannelTabs;
      params: Partial<ChannelUrlParams> | undefined;
    }
  | {
      route: Routes.OpenChannelListLiveStreams;
      params: Partial<ChannelUrlParams> | undefined;
    }
  | {
      route: Routes.OpenChannelListCommunity;
      params: Partial<ChannelUrlParams> | undefined;
    }
  | {
      route: Routes.OpenChannel;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.OpenChannelLiveStream;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.OpenChannelSettings;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.OpenChannelParticipants;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.OpenChannelCreate;
      params: undefined;
    }
  | {
      route: Routes.OpenChannelModeration;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.OpenChannelBannedUsers;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.OpenChannelMutedParticipants;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.OpenChannelOperators;
      params: ChannelUrlParams;
    }
  | {
      route: Routes.OpenChannelRegisterOperator;
      params: ChannelUrlParams;
    };

type ExtractParams<R extends Routes, U extends RouteParamsUnion> = U extends { route: R; params: infer P } ? P : never;
// type ExtractNavigatorParams<R extends Routes[]> = { [key in R[number]]: ExtractParams<key, RouteParamsUnion> };
export type RouteParams<R extends Routes> = ExtractParams<R, RouteParamsUnion>;
export type ParamListBase<T extends RouteParamsUnion = RouteParamsUnion> = {
  [k in T['route']]: T extends { route: k; params: infer P } ? P : never;
};

export type RouteProps<T extends Routes, P extends Record<string, unknown> = Record<string, string>> = {
  navigation: NativeStackNavigationProp<ParamListBase, T>;
  route: Route<T, RouteParams<T>>;
} & P;

export type ScreenPropsNavigation<T extends Routes> = RouteProps<T>['navigation'];
export type ScreenPropsRoute<T extends Routes> = RouteProps<T>['route'];

export const navigationRef = createNavigationContainerRef<ParamListBase>();
export const navigationActions = {
  navigate<T extends Routes>(name: T, params: RouteParams<T>) {
    if (navigationRef.isReady()) {
      const currentRoute = navigationRef.getCurrentRoute();
      if (currentRoute?.name === name) {
        // navigationRef.setParams(params);
        navigationRef.dispatch(StackActions.replace(name, params));
      } else {
        // @ts-ignore
        navigationRef.navigate<Routes>(name, params);
      }
    }
  },
  push<T extends Routes>(name: T, params: RouteParams<T>) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.push(name, params));
    }
  },
  goBack() {
    if (navigationRef.isReady()) {
      navigationRef.goBack();
    }
  },
};

export const runAfterAppReady = (callback: (sdk: SendbirdChatSDK, actions: typeof navigationActions) => void) => {
  const id = setInterval(async () => {
    if (navigationRef.isReady() && authManager.hasAuthentication() && GetSendbirdSDK()) {
      const sdk = GetSendbirdSDK();
      if (sdk.connectionState === 'OPEN') {
        clearInterval(id);
        callback(sdk, navigationActions);
      }
    }
  }, 1500);
};
