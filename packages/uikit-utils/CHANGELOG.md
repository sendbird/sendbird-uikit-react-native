# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.7.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.6.0...v3.7.0) (2024-08-08)

### Features

- support mmkv storage and deprecate a async storage ([ffbb8fc](https://github.com/sendbird/sendbird-uikit-react-native/commit/ffbb8fcc0434f914355cb28a9d522c6e276a6f7c))
- updated sample React version to 0.74.3 ([0e32587](https://github.com/sendbird/sendbird-uikit-react-native/commit/0e32587b51b07b160c72d393e044fb6532867d1f))

## [3.6.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.5.4...v3.6.0) (2024-07-09)

### Features

- added thread type in GroupChannel ([5e815ea](https://github.com/sendbird/sendbird-uikit-react-native/commit/5e815ea73efec563c50844ece052fae0fb0694b7))

## [3.5.4](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.5.3...v3.5.4) (2024-06-13)

**Note:** Version bump only for package @sendbird/uikit-utils

## [3.5.3](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.5.2...v3.5.3) (2024-05-28)

### Bug Fixes

- handle image/jpg mime type to determine image compress properly ([37f346d](https://github.com/sendbird/sendbird-uikit-react-native/commit/37f346d2483245c4653cde098537b50c974b4241))

## [3.5.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.5.1...v3.5.2) (2024-04-23)

**Note:** Version bump only for package @sendbird/uikit-utils

## [3.5.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.5.0...v3.5.1) (2024-04-08)

**Note:** Version bump only for package @sendbird/uikit-utils

## [3.5.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.4.3...v3.5.0) (2024-03-26)

### Features

- support reactions for super group channel ([8ab0720](https://github.com/sendbird/sendbird-uikit-react-native/commit/8ab07205c6bda1b9fe8c61153288ab6a6534dfca))

## [3.4.3](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.4.2...v3.4.3) (2024-03-20)

**Note:** Version bump only for package @sendbird/uikit-utils

## [3.4.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.4.1...v3.4.2) (2024-03-06)

**Note:** Version bump only for package @sendbird/uikit-utils

## [3.4.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.4.0...v3.4.1) (2024-02-06)

**Note:** Version bump only for package @sendbird/uikit-utils

## [3.4.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.3.0...v3.4.0) (2024-01-30)

**Note:** Version bump only for package @sendbird/uikit-utils

## [3.3.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.2.0...v3.3.0) (2023-11-23)

### Features

- add typing indicator bubble ui and logic ([9223b43](https://github.com/sendbird/sendbird-uikit-react-native/commit/9223b438f78d8b63da778c3c74329bdb383ba997))

## [3.2.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.1.2...v3.2.0) (2023-11-03)

### Features

- add yalc for local deployment ([7778d67](https://github.com/sendbird/sendbird-uikit-react-native/commit/7778d67c97dda62be02e2ac7c9390864549ef53a))
- **foundation:** implement voice file message component ([f6d90db](https://github.com/sendbird/sendbird-uikit-react-native/commit/f6d90db47dc933f607450667b4095b5926cd854d))
- implement voice message input ([9e6bc75](https://github.com/sendbird/sendbird-uikit-react-native/commit/9e6bc7551d0e28d020fc04599a833c0dd34bcd80))

### Bug Fixes

- await onClose for voice message input before displaying permission alert ([62ef277](https://github.com/sendbird/sendbird-uikit-react-native/commit/62ef277069a057bb4e5ee6331b2bcb9320bb6c7b))

### Improvements

- lift up the flatListRef to the provider and created MessageList context ([4a6efdc](https://github.com/sendbird/sendbird-uikit-react-native/commit/4a6efdcf71ce8659f1de5ea90a34be630e47df55))

## [3.1.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.1.1...v3.1.2) (2023-10-04)

### Features

- add localCacheEncryption interface to container prop ([3341992](https://github.com/sendbird/sendbird-uikit-react-native/commit/33419920352375ad7df08c19d32449179d2e52e9))

## [3.1.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.1.0...v3.1.1) (2023-08-23)

### Features

- use thumbnails if available ([62f3ca0](https://github.com/sendbird/sendbird-uikit-react-native/commit/62f3ca0b209c5362bd335dbe22619dc053509fda))

## [3.1.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.0.4...v3.1.0) (2023-08-11)

### Bug Fixes

- unsent messages should be shown first of the message list ([3a4544e](https://github.com/sendbird/sendbird-uikit-react-native/commit/3a4544e1006cd4b9ac13c62aebc63572453fb496))

## [3.0.4](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.0.3...v3.0.4) (2023-07-13)

### Bug Fixes

- **utils:** extension should not contain dot in getMimeFromFileExtension ([7be3d0c](https://github.com/sendbird/sendbird-uikit-react-native/commit/7be3d0cdddff6fbfca7f2442eba9bfed8bf80357))
- **utils:** getFileExtensionFromUri should return extension not a mime-type ([e2df878](https://github.com/sendbird/sendbird-uikit-react-native/commit/e2df878d5dc0946cdd0003af4e77e1aeca60ba72))
- **utils:** return extension of getFileExtensionFromMime should contain dot ([85b6d18](https://github.com/sendbird/sendbird-uikit-react-native/commit/85b6d18be278e25491f9274352c12a6118ffff02))

## [3.0.3](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.0.2...v3.0.3) (2023-07-11)

**Note:** Version bump only for package @sendbird/uikit-utils

## [3.0.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.0.1...v3.0.2) (2023-07-10)

**Note:** Version bump only for package @sendbird/uikit-utils

## [3.0.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.0.0...v3.0.1) (2023-07-04)

**Note:** Version bump only for package @sendbird/uikit-utils

## [3.0.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.5.0...v3.0.0) (2023-06-28)

### ⚠ BREAKING CHANGES

- update minimum chat sdk version

### Features

- hide ui elements when the channel is ephemeral ([eacc2da](https://github.com/sendbird/sendbird-uikit-react-native/commit/eacc2dad02271d17b26071c716d41bcdfead1957))
- update minimum chat sdk version ([5330d1f](https://github.com/sendbird/sendbird-uikit-react-native/commit/5330d1fb533a614f7edb1614cc379c842768e4cf))

### Improvements

- defensively modify reducer logic to prevent duplicate objects ([bc3cfb1](https://github.com/sendbird/sendbird-uikit-react-native/commit/bc3cfb193ff6c59cbf636a05fbd1ad8cead699e1))

## [2.5.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.4.2...v2.5.0) (2023-05-04)

### Features

- added message search fragment ([a6342c0](https://github.com/sendbird/sendbird-uikit-react-native/commit/a6342c09c2007ac2372f4a630499382aae34d6de))
- implemented scroll-view enhancer ([1dca4a0](https://github.com/sendbird/sendbird-uikit-react-native/commit/1dca4a062b45bffc781beec88c311cb6d83463fe))

### Bug Fixes

- **uikit:** do not handle onUserBanned in open channel list ([8ba9daa](https://github.com/sendbird/sendbird-uikit-react-native/commit/8ba9daaa2f56076d00761f684c890292d5ced03e))

## [2.4.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.4.1...v2.4.2) (2023-04-28)

**Note:** Version bump only for package @sendbird/uikit-utils

## [2.4.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.4.0...v2.4.1) (2023-03-24)

### Bug Fixes

- **utils:** properly retrieve file extensions from URLs that contain query parameters ([7401d55](https://github.com/sendbird/sendbird-uikit-react-native/commit/7401d55d43e1fd0094ea459c554ea85ee48c9f2c))

### Improvements

- refactored createFileService functions and utils structure ([5e44d4f](https://github.com/sendbird/sendbird-uikit-react-native/commit/5e44d4f7a989df54f103efc67f7d18c28405426c))

## [2.4.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.3.0...v2.4.0) (2023-03-15)

### Features

- added open channel message components ([2cbdcba](https://github.com/sendbird/sendbird-uikit-react-native/commit/2cbdcbab09f737918d9e93fe8ae325abf7424280))
- **uikit:** added open channel create fragment ([21d4bb5](https://github.com/sendbird/sendbird-uikit-react-native/commit/21d4bb5a45a48e4404509b825eb34a873dd5e8a7))
- **uikit:** added open channel fragment ([6250770](https://github.com/sendbird/sendbird-uikit-react-native/commit/62507708a40a3c92655d29615ff90fb3961877a5))
- **uikit:** added open channel muted participants fragment ([f876ba7](https://github.com/sendbird/sendbird-uikit-react-native/commit/f876ba7777279b7b6080f764d25aaf86b5b49233))
- **uikit:** added open channel participants fragment ([c4dd37f](https://github.com/sendbird/sendbird-uikit-react-native/commit/c4dd37f67f4c69b4ae70939e7beb374f3eb81af8))
- **uikit:** added open channel settings fragment ([48ebf2a](https://github.com/sendbird/sendbird-uikit-react-native/commit/48ebf2ae8888a93de710c313d4151d955ef67735))
- **utils:** added useDebounceEffect hook ([dc90bb4](https://github.com/sendbird/sendbird-uikit-react-native/commit/dc90bb420c42c705bf3b01a4ab6250e89c68ab4f))
- **utils:** added usePartialState hook ([f76fe69](https://github.com/sendbird/sendbird-uikit-react-native/commit/f76fe69f7f4b2d54902ce25506a84f638023d496))

### Improvements

- **uikit:** expanded interfaces for channel input to make customization implementation easier ([4d3f183](https://github.com/sendbird/sendbird-uikit-react-native/commit/4d3f1838c89e7be88ca2e12deb237b09afb5996a))

## [2.3.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.2.0...v2.3.0) (2023-02-09)

### Features

- **utils:** added useSafeAreaPadding hook ([80cd9ab](https://github.com/sendbird/sendbird-uikit-react-native/commit/80cd9abea96a95cb3f51a7c8ecc87c0bbd7e104d))

### Bug Fixes

- **uikit:** support compatibility for removing AppState listener under 0.65 ([b122691](https://github.com/sendbird/sendbird-uikit-react-native/commit/b12269130dd5648c4afe5497957ef47832ca6672))

## [2.2.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.1.0...v2.2.0) (2023-01-03)

### Features

- **foundation:** added reaction ui color ([5b272e5](https://github.com/sendbird/sendbird-uikit-react-native/commit/5b272e57bbec5ece4bbcdaecb88fddd5ec3759f4))
- **uikit:** added emoji manager ([1cad175](https://github.com/sendbird/sendbird-uikit-react-native/commit/1cad175228c89ea995743279ddcbf6ddc0b099e8))
- **uikit:** added reaction bottom sheets ([07ae1ad](https://github.com/sendbird/sendbird-uikit-react-native/commit/07ae1ad0608ed9c28760c135fe631ced17159bb1))
- **uikit:** added reaction user list bottom sheet ([e9ef7e9](https://github.com/sendbird/sendbird-uikit-react-native/commit/e9ef7e9b4715e49a41802453aae95f283917e03b))

### Bug Fixes

- added missing keyExtractor to list components of modules ([4ee1108](https://github.com/sendbird/sendbird-uikit-react-native/commit/4ee110878522e1486882285869b68ad7ec98438f))

### Improvements

- update time format ([708be93](https://github.com/sendbird/sendbird-uikit-react-native/commit/708be932005f0911e63a5d77ace1cb779357beb9))

## [2.1.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.0.3...v2.1.0) (2022-12-06)

### Features

- **uikit:** added group channel banned users fragment ([80e1a5e](https://github.com/sendbird/sendbird-uikit-react-native/commit/80e1a5ebaf6b80e6bb015ff64a9b4cc6ef2e19d7))
- **uikit:** added mini profile card ([0877463](https://github.com/sendbird/sendbird-uikit-react-native/commit/08774638ba0e283f6da2c63545be746746b64058))
- **uikit:** added moderation in group channel members ([9b25059](https://github.com/sendbird/sendbird-uikit-react-native/commit/9b250594fa3ecf4c02ceeb3ea035ac7060fcf0f5))
- **utils:** added buffered request function ([d3e375c](https://github.com/sendbird/sendbird-uikit-react-native/commit/d3e375cc05721c251846d27eb2f8f8e86ad4379f))

## [2.0.3](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.0.1...v2.0.3) (2022-12-01)

### Improvements

- optimize markAs APIs ([b0fb3aa](https://github.com/sendbird/sendbird-uikit-react-native/commit/b0fb3aa86636b03f0dcc6337eaa17c7336b5bea9))

## [2.0.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.0.0...v2.0.1) (2022-10-26)

**Note:** Version bump only for package @sendbird/uikit-utils

## [2.0.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.0.0-rc.0...v2.0.0) (2022-10-11)

**Note:** Version bump only for package @sendbird/uikit-utils

## [2.0.0-rc.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.1.2...v2.0.0-rc.0) (2022-10-11)

### ⚠ BREAKING CHANGES

- migrated to Chat SDK v4

### Features

- migrated to Chat SDK v4 ([5ce9e4f](https://github.com/sendbird/sendbird-uikit-react-native/commit/5ce9e4f99bfac790ce66cc13c7e390e578f08713))

### Bug Fixes

- **utils:** remove useLayoutEffect sync from useFreshCallback ([d5656be](https://github.com/sendbird/sendbird-uikit-react-native/commit/d5656becb20f5f2927610f87c40b404a2db74516))

## [1.1.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.1.1...v1.1.2) (2022-09-28)

### Bug Fixes

- fixed createFileService.native to save media files properly on Android (QM-1766) ([939d2b4](https://github.com/sendbird/sendbird-uikit-react-native/commit/939d2b4d637cf46de8f38ea16ed0460ab90f1f8f))

## [1.1.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.1.0...v1.1.1) (2022-09-14)

### Features

- **chat-hooks:** added useMessageOutgoingStatus hook ([f3af2a7](https://github.com/sendbird/sendbird-uikit-react-native/commit/f3af2a7e265486a35e209d6353d2b74e7b2c3cba))

### Bug Fixes

- **chat-hooks:** respect the order of group channel collection and query. ([913875d](https://github.com/sendbird/sendbird-uikit-react-native/commit/913875db138518fd03648074fe959617ae67b791))

## [1.1.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.2...v1.1.0) (2022-08-31)

### Features

- **uikit:** added file viewer component ([9b9d52b](https://github.com/sendbird/sendbird-uikit-react-native/commit/9b9d52b58dd508bce5c577ec5975cd2ef21ccd77))

## [1.0.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0...v1.0.2) (2022-08-09)

### Improvements

- remove React.FC ([303f80b](https://github.com/sendbird/sendbird-uikit-react-native/commit/303f80be04cc4631a6103dad61c4540d9ad7596a))

## [1.0.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0...v1.0.1) (2022-08-09)

### Improvements

- remove React.FC ([303f80b](https://github.com/sendbird/sendbird-uikit-react-native/commit/303f80be04cc4631a6103dad61c4540d9ad7596a))

# [1.0.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.4...v1.0.0) (2022-07-26)

**Note:** Version bump only for package @sendbird/uikit-utils

# [1.0.0-rc.4](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.3...v1.0.0-rc.4) (2022-07-26)

**Note:** Version bump only for package @sendbird/uikit-utils

# [1.0.0-rc.3](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.2...v1.0.0-rc.3) (2022-07-26)

**Note:** Version bump only for package @sendbird/uikit-utils

# [1.0.0-rc.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.1...v1.0.0-rc.2) (2022-07-26)

**Note:** Version bump only for package @sendbird/uikit-utils

# [1.0.0-rc.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.0...v1.0.0-rc.1) (2022-07-26)

**Note:** Version bump only for package @sendbird/uikit-utils

# [1.0.0-rc.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v0.1.2...v1.0.0-rc.0) (2022-07-26)

### Bug Fixes

- **chat-hooks:** rename module ([7a2c30c](https://github.com/sendbird/sendbird-uikit-react-native/commit/7a2c30cf136883ef551ae59e9cc848fea81088ff))
- improve stability ([72648d1](https://github.com/sendbird/sendbird-uikit-react-native/commit/72648d14e00a01b4c856e7b794a6a22ee7e5b9d7))
- update sdk, fix locale injection ([a86ad81](https://github.com/sendbird/sendbird-uikit-react-native/commit/a86ad81f05ebbd42dd65f1ae0919e4459cbb9439))
- **util:** url replacer ([07753b1](https://github.com/sendbird/sendbird-uikit-react-native/commit/07753b19547d13f8a76c2850009ae71fda20aa27))

### Features

- **uikit:** added extension ([52de301](https://github.com/sendbird/sendbird-uikit-react-native/commit/52de301bd8cfa7f660162e0c4951e4db53a3238e))

## 0.1.2 (2022-04-26)

### Bug Fixes

- fixed channel preview update properly ([b8b3d53](https://github.com/sendbird/sendbird-uikit-react-native/commit/b8b3d536d80b1f15b39e47e428d648da4f513831))
- lint warnings ([caeff54](https://github.com/sendbird/sendbird-uikit-react-native/commit/caeff5405451745466d87546b104a84848ff3a7e))
- **utils:** added react-native dependency ([d6ccf01](https://github.com/sendbird/sendbird-uikit-react-native/commit/d6ccf019f9722c664d2ba00befe53c455466d244))
- **utils:** pubsub enhancement ([2006249](https://github.com/sendbird/sendbird-uikit-react-native/commit/2006249e34777293b04dd06f9186cf1436298c6e))

### Features

- added default locale string set ([1c66add](https://github.com/sendbird/sendbird-uikit-react-native/commit/1c66add5f1afc4986b13c4783c738c713136a753))
- added message components ([682cdb4](https://github.com/sendbird/sendbird-uikit-react-native/commit/682cdb433e316f03797b2021c0eba8a313b7cf8e))
- added storybook ([eddf162](https://github.com/sendbird/sendbird-uikit-react-native/commit/eddf162029268390233d2a2de23fb6f081e3c432))
- **core:** added message handlers ([2d9f1c4](https://github.com/sendbird/sendbird-uikit-react-native/commit/2d9f1c40d273df9c73b0ad4d8b9d6794af73a576))
- **core:** implement send message and file pick flow ([2cc40f8](https://github.com/sendbird/sendbird-uikit-react-native/commit/2cc40f895b59764bd74e8f27513ebb7131721ca1))
- create modularization template script ([ccf022d](https://github.com/sendbird/sendbird-uikit-react-native/commit/ccf022d1da90a88573a1c64c508ad93e22a816d8))
- create type selector ([6139231](https://github.com/sendbird/sendbird-uikit-react-native/commit/6139231e16dc1d78336fb8a1ce0677c43eaf6c30))
- **foundation:** added Prompt and Input component ([1bc173a](https://github.com/sendbird/sendbird-uikit-react-native/commit/1bc173af436782a3e6fd34b0d67665d2c44f25ad))
- **sample:** added create channel ([66e7ae9](https://github.com/sendbird/sendbird-uikit-react-native/commit/66e7ae9a035b3b46e58032ba8336bc93fe04131c))
- **sample:** added ios notification ([44ef9f7](https://github.com/sendbird/sendbird-uikit-react-native/commit/44ef9f70cd2bc38ba605c5fd8bf4e1d70cfe03d2))
- **sample:** added settings ui ([bb81801](https://github.com/sendbird/sendbird-uikit-react-native/commit/bb818015db8aaafa5ca3b0761b20bf4f1bf1c9fc))
- setup lerna ([#21](https://github.com/sendbird/sendbird-uikit-react-native/issues/21)) ([1382c42](https://github.com/sendbird/sendbird-uikit-react-native/commit/1382c4286c07bcb9a3f8a8c32d757c451610cc76))
