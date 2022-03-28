import { useNavigation, useRoute } from '@react-navigation/native';

import type { Routes, ScreenPropsNavigation, ScreenPropsRoute } from '../libs/navigation';

export const useRouteParams = <T extends Routes>() => {
  const { params } = useRoute<ScreenPropsRoute<T>>();
  return params as NonNullable<typeof params>;
};

export const useAppNavigation = <T extends Routes>() => {
  const navigation = useNavigation<ScreenPropsNavigation<T>>();
  const params = useRouteParams<T>();

  return { navigation, params };
};
