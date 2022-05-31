# sendbird-uikit-react-native

uikit

[![Status_Build](https://github.com/sendbird/sendbird-uikit-react-native/actions/workflows/status-build.yml/badge.svg)](https://github.com/sendbird/sendbird-uikit-react-native/actions/workflows/status-build.yml)
[![Status_Test](https://github.com/sendbird/sendbird-uikit-react-native/actions/workflows/status-test.yml/badge.svg)](https://github.com/sendbird/sendbird-uikit-react-native/actions/workflows/status-test.yml)

---

## Scripts

### Lint & Prettier

- check: `yarn lint`
- fix: `yarn fix`

### Test

- test: `yarn test`

### Package dependencies

- add: `yarn workspace @sendbird/package add some-package`
- remove: `yarn workspace @sendbird/package remove some-package`

### Publish
> Bump > Build > Deploy 

- bump script: `lerna version {major|minor|patch} [--no-git-tag-version] [--no-private]` or `yarn bump:{major|minor|patch}`
- build script: `yarn build`
