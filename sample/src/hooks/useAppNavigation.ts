import { Route, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { GroupChannelType } from '@sendbird/uikit-react-native-core';

export enum Routes {
  Home = 'Home',

  Storybook = 'Storybook',
  Palette = 'Palette',
  ThemeColors = 'ThemeColors',

  GroupChannelTabs = 'GroupChannelTabs',
  GroupChannelList = 'GroupChannelList',
  GroupChannel = 'GroupChannel',
  InviteMembers = 'InviteMembers',
  Settings = 'Settings',
}

export type RouteParamsUnion =
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
      route: Routes.GroupChannel;
      params: {
        /** GroupChannel.serialize() */
        serializedChannel: object;
      };
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
      route: Routes.InviteMembers;
      params: { channelType: GroupChannelType };
    };

type ExtractParams<R extends Routes, U extends RouteParamsUnion> = U extends { route: R } ? U['params'] : never;
type RouteParams<R extends Routes> = ExtractParams<R, RouteParamsUnion>;
type ParamListBase<T extends RouteParamsUnion = RouteParamsUnion> = {
  [k in T['route']]: T['params'];
};

export type RouteProps<T extends Routes, P extends Record<string, unknown> = Record<string, string>> = {
  navigation: NativeStackNavigationProp<ParamListBase, T>;
  route: Route<T, RouteParams<T>>;
} & P;

type ScreenPropsNavigation<T extends Routes> = RouteProps<T>['navigation'];
type ScreenPropsRoute<T extends Routes> = RouteProps<T>['route'];

export const useRouteParams = <T extends Routes>() => {
  const { params } = useRoute<ScreenPropsRoute<T>>();
  return params as NonNullable<typeof params>;
};

export const useAppNavigation = <T extends Routes>() => {
  const navigation = useNavigation<ScreenPropsNavigation<T>>();
  const params = useRouteParams<T>();

  return { navigation, params };
};
