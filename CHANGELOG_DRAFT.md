## v3.8.0

- **Dependency Update**  
  The minimum version of `@sendbird/chat` has been bumped to `4.16.0`.

- **Reaction Support in Supergroup**  
  Reactions are now supported in supergroups. This update introduces a simplified `ReactedUserInfo` type, replacing the previous `User` and `Member` types for reaction-related data. For more details, please refer to the [#217](https://github.com/sendbird/sendbird-uikit-react-native/pull/217).

- **RTL Support**  
  Right-to-left (RTL) support is now automatically activated based on the language.

  ```ts
  import { I18nManager } from 'react-native';

  // To allow RTL support, use the following code:
  I18nManager.allowRTL(true);

  // To test RTL, you can force RTL by using the following code:
  // I18nManager.forceRTL(true);
  ```

  **Android**: Add the following line to your `AndroidManifest.xml` to enable RTL support:

  ```xml
  <application
      android:supportsRtl="true">
  </application>
  ```

  **iOS**: For iOS, enable RTL support by adding supported languages in the Localizations section of your Xcode project settings.

- **Improved stability**  
  Some bugs related to voice messages have been fixed.
