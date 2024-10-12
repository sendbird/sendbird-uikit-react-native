import React from 'react';
const useMyLocale = () => ({ locale: 'en' as const, setLocale: (_: 'en' | 'ko') => 'en' });
const Navigations = () => <></>;

/**
 * Customize the StringSet
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/resources/string-resource#2-customize-the-stringset}
 * */
import { View } from 'react-native';
import { ko } from 'date-fns/locale';
import { StringSetEn, createBaseStringSet, SendbirdUIKitContainer, useLocalization } from '@sendbird/uikit-react-native';
import { Text, Button } from '@sendbird/uikit-react-native-foundation';

const StringSetKo = createBaseStringSet({
  dateLocale: ko,
  overrides: {
    LABELS: {
      USER_NO_NAME: '(이름없음)',
      TYPING_INDICATOR_TYPINGS: (users) => {
        if (users.length === 0) return '';
        return `${users.length}명이 입력중...`;
      },
    },
    // ...
  },
});

const StringSets = {
  'en': StringSetEn,
  'ko': StringSetKo,
};

const App = () => {
  const { locale, setLocale } = useMyLocale();
  return (
    // @ts-ignore
    <SendbirdUIKitContainer localization={{ stringSet: StringSets[locale] }}>
      <Navigations />
    </SendbirdUIKitContainer>
  );
};

const SwitchLanguageButton = () => {
  const { locale, setLocale } = useMyLocale();
  const { STRINGS } = useLocalization();
  const nextLocale = locale === 'en' ? 'ko' : 'en';

  return (
    <View>
      <Button onPress={() => setLocale(nextLocale)}>{`Change to ${nextLocale}`}</Button>
      <Text>{STRINGS.LABELS.USER_NO_NAME}</Text>
    </View>
  );
};
/** ------------------ **/
