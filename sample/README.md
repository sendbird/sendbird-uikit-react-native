# UIKit for React-Native Sample

This sample is based on React-Native CLI. <br/>
Sample for expo: https://github.com/sendbird/sendbird-uikit-sample-react-native-expo

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
