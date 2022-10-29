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

  GroupChannelTabs = 'GroupChannelTabs',
  GroupChannelList = 'GroupChannelList',
  GroupChannel = 'GroupChannel',

  GroupChannelSettings = 'GroupChannelSettings',
  GroupChannelMembers = 'GroupChannelMembers',
  GroupChannelModerations = 'GroupChannelModerations',
  GroupChannelOperators = 'GroupChannelOperators',
  GroupChannelOperatorsAdd = 'GroupChannelOperatorsAdd',
  GroupChannelMutedMembers = 'GroupChannelMutedMembers',
  GroupChannelBannedUsers = 'GroupChannelBannedUsers',

  GroupChannelCreate = 'GroupChannelCreate',
  GroupChannelInvite = 'GroupChannelInvite',
  Settings = 'Settings',
  FileViewer = 'FileViewer',
}

export type RouteParamsUnion =
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
      route: Routes.GroupChannelList;
      params: undefined;
    }
  | {
      route: Routes.GroupChannelCreate;
      params: { channelType: GroupChannelType };
    }
  | {
      route: Routes.GroupChannel;
      params: { channelUrl: string };
    }
  | {
      route: Routes.GroupChannelSettings;
      params: { channelUrl: string };
    }
  | {
      route: Routes.GroupChannelMembers;
      params: { channelUrl: string };
    }
  | {
      route: Routes.GroupChannelModerations;
      params: { channelUrl: string };
    }
  | {
      route: Routes.GroupChannelOperators;
      params: { channelUrl: string };
    }
  | {
      route: Routes.GroupChannelOperatorsAdd;
      params: { channelUrl: string };
    }
  | {
      route: Routes.GroupChannelMutedMembers;
      params: { channelUrl: string };
    }
  | {
      route: Routes.GroupChannelBannedUsers;
      params: { channelUrl: string };
    }
  | {
      route: Routes.GroupChannelInvite;
      params: { channelUrl: string };
    }
  | {
      route: Routes.Settings;
      params: undefined;
    }
  | {
      route: Routes.GroupChannelTabs;
      params: undefined;
    }
  | {
      route: Routes.FileViewer;
      params: {
        serializedFileMessage: object;
        deleteMessage: () => Promise<void>;
      };
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
  }, 250);
};
