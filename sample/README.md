# UIKit for React-Native Sample

This sample is based on React-Native CLI. <br/>
Sample for expo: https://github.com/sendbird/sendbird-uikit-sample-react-native-expo

### Requirements

- Nodejs 18.20 or newer

### Installation

**Install node modules**

```shell
yarn install
```

**Linking native modules of sample app**

```shell
npx pod-install
```

**Running sample app**

- Android

```shell
yarn android
```

- iOS

```shell
yarn ios
```

### Sample app using your data

Create a file to `sample/src/env.ts` and write the code below to the file you created.

```ts
export const APP_ID = '2D7B4CDB-932F-4082-9B09-A1153792DC8D';
```

If you would like to try the sample app specifically fit to your usage, you can do so by replacing the default sample app ID with yours, which you can obtain by creating your [Sendbird application from the dashboard](https://dashboard.sendbird.com/).

### Trouble shooting

- Could not connect to development server on Android device
  - Run `adb reverse tcp:8081 tcp:8081`.
- Unable to resolve module `../version` from `packages/uikit-react-native/src/containers/SendbirdUIKitContainer.tsx`
  - Run `yarn workspace @sendbird/uikit-react-native generate-version` on the root of the project.
- `concurrently 'yarn start' 'react-native run-android'` does not working expected
  - Run `yarn start` and `npx react-native run-android` separately on the `sample` directory.
