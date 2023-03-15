# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.4.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.3.0...v2.4.0) (2023-03-15)


### Features

* added open channel message components ([2cbdcba](https://github.com/sendbird/sendbird-uikit-react-native/commit/2cbdcbab09f737918d9e93fe8ae325abf7424280))
* **uikit:** added open channel banned users fragment. ([391a871](https://github.com/sendbird/sendbird-uikit-react-native/commit/391a8713496d688a4d05dec5e85e9555db05b325))
* **uikit:** added open channel create fragment ([21d4bb5](https://github.com/sendbird/sendbird-uikit-react-native/commit/21d4bb5a45a48e4404509b825eb34a873dd5e8a7))
* **uikit:** added open channel fragment ([6250770](https://github.com/sendbird/sendbird-uikit-react-native/commit/62507708a40a3c92655d29615ff90fb3961877a5))
* **uikit:** added open channel list fragment ([61fff68](https://github.com/sendbird/sendbird-uikit-react-native/commit/61fff68d8d012573006e2009e3ff93fbd94dcb12))
* **uikit:** added open channel moderation fragment ([539b3d2](https://github.com/sendbird/sendbird-uikit-react-native/commit/539b3d207c23a67e2af7b35008977f883a7a74d8))
* **uikit:** added open channel muted participants fragment ([f876ba7](https://github.com/sendbird/sendbird-uikit-react-native/commit/f876ba7777279b7b6080f764d25aaf86b5b49233))
* **uikit:** added open channel operators fragment ([aea29af](https://github.com/sendbird/sendbird-uikit-react-native/commit/aea29af01a4c6275b1d797eef5f8e07bae0d615a))
* **uikit:** added open channel participants fragment ([c4dd37f](https://github.com/sendbird/sendbird-uikit-react-native/commit/c4dd37f67f4c69b4ae70939e7beb374f3eb81af8))
* **uikit:** added open channel register operator fragment ([be883c9](https://github.com/sendbird/sendbird-uikit-react-native/commit/be883c9481198cade983595c3b0c24f0fc8c7583))
* **uikit:** added open channel settings fragment ([48ebf2a](https://github.com/sendbird/sendbird-uikit-react-native/commit/48ebf2ae8888a93de710c313d4151d955ef67735))
* **utils:** added useDebounceEffect hook ([dc90bb4](https://github.com/sendbird/sendbird-uikit-react-native/commit/dc90bb420c42c705bf3b01a4ab6250e89c68ab4f))


### Bug Fixes

* **uikit:** added missing onLoadNext call to user list components ([6592e11](https://github.com/sendbird/sendbird-uikit-react-native/commit/6592e110deaba0a14dc98eee098501c72064077a))


### Improvements

* replaced useUniqId to useUniqHandlerId ([543e149](https://github.com/sendbird/sendbird-uikit-react-native/commit/543e1496f9ac9c92845fd2d98902dc3efe28ec06))
* **uikit:** added `disabled` option to `errorBoundary` in `SendbirdUIKitContainer` props ([6070d54](https://github.com/sendbird/sendbird-uikit-react-native/commit/6070d54990015addf40dceb4ad81f072cef1f778))
* **uikit:** expanded interfaces for channel input to make customization implementation easier ([4d3f183](https://github.com/sendbird/sendbird-uikit-react-native/commit/4d3f1838c89e7be88ca2e12deb237b09afb5996a))
* **uikit:** extract base channel input component from group channel module ([462291e](https://github.com/sendbird/sendbird-uikit-react-native/commit/462291e40b67ba2767e44be34534d20ff52052d1))



## [2.3.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.2.0...v2.3.0) (2023-02-09)


### Features

* added image compression feature ([568b5bb](https://github.com/sendbird/sendbird-uikit-react-native/commit/568b5bb86efa2cd1310be62207b4f2345d159d21))


### Bug Fixes

* added missing labels for permissions ([89186bd](https://github.com/sendbird/sendbird-uikit-react-native/commit/89186bd5a64573a0994495c927cd1442f0af5e80))
* **uikit:** fixed to useContext type compiles the correct package path ([d17ccb0](https://github.com/sendbird/sendbird-uikit-react-native/commit/d17ccb0a1a492b6ec6558e97e7d3b35021db2242))
* **uikit:** support compatibility for removing AppState listener under 0.65 ([b122691](https://github.com/sendbird/sendbird-uikit-react-native/commit/b12269130dd5648c4afe5497957ef47832ca6672))



## [2.2.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.1.0...v2.2.0) (2023-01-03)


### Features

* added group channel notifications fragment ([dfb891d](https://github.com/sendbird/sendbird-uikit-react-native/commit/dfb891d76e79ad33f1b184c248e0d0688add2c13))
* **foundation:** added mention related props to group channel preview ([507a1af](https://github.com/sendbird/sendbird-uikit-react-native/commit/507a1af747ca5190e436028c4755f5ebab685cad))
* **uikit:** added emoji manager ([1cad175](https://github.com/sendbird/sendbird-uikit-react-native/commit/1cad175228c89ea995743279ddcbf6ddc0b099e8))
* **uikit:** added reaction addons ([1a0db30](https://github.com/sendbird/sendbird-uikit-react-native/commit/1a0db308f517d2da280db68f2d81a743174dccfb))
* **uikit:** added reaction bottom sheets ([07ae1ad](https://github.com/sendbird/sendbird-uikit-react-native/commit/07ae1ad0608ed9c28760c135fe631ced17159bb1))
* **uikit:** added reaction user list bottom sheet ([e9ef7e9](https://github.com/sendbird/sendbird-uikit-react-native/commit/e9ef7e9b4715e49a41802453aae95f283917e03b))


### Bug Fixes

* added missing keyExtractor to list components of modules ([4ee1108](https://github.com/sendbird/sendbird-uikit-react-native/commit/4ee110878522e1486882285869b68ad7ec98438f))
* android selection bug ([d2b4c8c](https://github.com/sendbird/sendbird-uikit-react-native/commit/d2b4c8c8b6a7216a4dedf6445daf0f951f34b4c9))


### Improvements

* update time format ([708be93](https://github.com/sendbird/sendbird-uikit-react-native/commit/708be932005f0911e63a5d77ace1cb779357beb9))



## [2.1.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.0.3...v2.1.0) (2022-12-06)


### ⚠ BREAKING CHANGES

* **uikit:** update camera roll module

### Features

* added group channel type selector ([9fb7a19](https://github.com/sendbird/sendbird-uikit-react-native/commit/9fb7a193b5e245ba89030ef9c9d8abae95cf4bba))
* **chat-hooks:** added useGroupChannel hook ([9392dea](https://github.com/sendbird/sendbird-uikit-react-native/commit/9392dea1f5b7c5a102c0aa96107a472f8433bae8))
* support broadcast and supergroup channel ([895fa3b](https://github.com/sendbird/sendbird-uikit-react-native/commit/895fa3b27ffb06977fb326610e8234cfb812ec1f))
* **uikit:** added enableUseUserIdForNickname option ([5d3cfd8](https://github.com/sendbird/sendbird-uikit-react-native/commit/5d3cfd839ba7b0a58f7aba19d46b07b5d8dbea2d))
* **uikit:** added group channel banned users fragment ([80e1a5e](https://github.com/sendbird/sendbird-uikit-react-native/commit/80e1a5ebaf6b80e6bb015ff64a9b4cc6ef2e19d7))
* **uikit:** added group channel moderations fragment ([4213e6d](https://github.com/sendbird/sendbird-uikit-react-native/commit/4213e6dc279739d69dc2617de54ba1446c0e16e3))
* **uikit:** added group channel muted members fragment ([3784b73](https://github.com/sendbird/sendbird-uikit-react-native/commit/3784b7364835fde061f91b157632dc864f555ab1))
* **uikit:** added group channel operators add fragment ([4ac84ee](https://github.com/sendbird/sendbird-uikit-react-native/commit/4ac84ee727b4336555ed84deb70775c308b6d2e5))
* **uikit:** added group channel operators fragment ([c7f6626](https://github.com/sendbird/sendbird-uikit-react-native/commit/c7f6626afd4236542f41aee48cfcdf9b217835b1))
* **uikit:** added mini profile card ([0877463](https://github.com/sendbird/sendbird-uikit-react-native/commit/08774638ba0e283f6da2c63545be746746b64058))
* **uikit:** added moderation in group channel members ([9b25059](https://github.com/sendbird/sendbird-uikit-react-native/commit/9b250594fa3ecf4c02ceeb3ea035ac7060fcf0f5))


### Improvements

* **chat-hooks:** removed activeChannel from useGroupChannelMessages for normalizing ([70fb1c7](https://github.com/sendbird/sendbird-uikit-react-native/commit/70fb1c7ec2acad4f74d95c37c6d0bdf66d3eab88))
* **uikit:** update camera roll module ([5ddb5d3](https://github.com/sendbird/sendbird-uikit-react-native/commit/5ddb5d33f81d8fdd7b4dd2fa541cd687d5a9bd30))



## [2.0.3](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.0.1...v2.0.3) (2022-12-01)


### Improvements

* optimize markAs APIs ([b0fb3aa](https://github.com/sendbird/sendbird-uikit-react-native/commit/b0fb3aa86636b03f0dcc6337eaa17c7336b5bea9))



## [2.0.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.0.0...v2.0.1) (2022-10-26)


### Bug Fixes

* **uikit:** call setBackgroundState only on background status ([ca89ecc](https://github.com/sendbird/sendbird-uikit-react-native/commit/ca89ecc7305977f584159d2cc9b25498f22f7b0b))



## [2.0.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.0.0-rc.0...v2.0.0) (2022-10-11)

**Note:** Version bump only for package @sendbird/uikit-react-native





## [2.0.0-rc.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.1.2...v2.0.0-rc.0) (2022-10-11)


### ⚠ BREAKING CHANGES

* migrated to Chat SDK v4

### Features

* migrated to Chat SDK v4 ([5ce9e4f](https://github.com/sendbird/sendbird-uikit-react-native/commit/5ce9e4f99bfac790ce66cc13c7e390e578f08713))


### Documentation

* update core components ([040dbb4](https://github.com/sendbird/sendbird-uikit-react-native/commit/040dbb442427428e1d522a8adaf802eb073942a9))
* update README ([a1b7452](https://github.com/sendbird/sendbird-uikit-react-native/commit/a1b74524741af306b32736b9338d28ead3769bc7))



## [1.1.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.1.1...v1.1.2) (2022-09-28)


### Features

* added an alert to go to app settings when permission is not granted (QM-1799) ([dfb9322](https://github.com/sendbird/sendbird-uikit-react-native/commit/dfb9322dc0b1f26e8c0f69f761966f6a2f326e67))


### Bug Fixes

* ellipsis name in the message (QM-1788, QM-1790) ([cf39461](https://github.com/sendbird/sendbird-uikit-react-native/commit/cf39461810161a23599860964ebdd78e35192e4a))
* fixed createFileService.native to save media files properly on Android (QM-1766) ([939d2b4](https://github.com/sendbird/sendbird-uikit-react-native/commit/939d2b4d637cf46de8f38ea16ed0460ab90f1f8f))
* fixed createFileService.native to save video files properly on iOS13 (QM-1765) ([811039b](https://github.com/sendbird/sendbird-uikit-react-native/commit/811039b57d1a4d1024130ff2d78ce164c92af0fa))
* truncate file viewer header title(QM-1798) ([6c34292](https://github.com/sendbird/sendbird-uikit-react-native/commit/6c3429243075cfd0f05026526a8e3945cc0e0b8f))



## [1.1.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.1.0...v1.1.1) (2022-09-14)


### Features

* **chat-hooks:** added useMessageOutgoingStatus hook ([f3af2a7](https://github.com/sendbird/sendbird-uikit-react-native/commit/f3af2a7e265486a35e209d6353d2b74e7b2c3cba))


### Bug Fixes

* added missing collectionCreator prop to GroupChannelListFragment ([d06d60e](https://github.com/sendbird/sendbird-uikit-react-native/commit/d06d60e76639eb1f68bfef8d63ed1f79e1d3069d))
* **chat-hooks:** respect the order of group channel collection and query. ([913875d](https://github.com/sendbird/sendbird-uikit-react-native/commit/913875db138518fd03648074fe959617ae67b791))



## [1.1.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.2...v1.1.0) (2022-08-31)


### Features

* **uikit:** added file viewer component ([9b9d52b](https://github.com/sendbird/sendbird-uikit-react-native/commit/9b9d52b58dd508bce5c577ec5975cd2ef21ccd77))
* **uikit:** added TypingIndicator and MessageReceiptStatus in Channel List ([39c54fc](https://github.com/sendbird/sendbird-uikit-react-native/commit/39c54fcfa617def1f2b1dcb05eaa990dd19abc52))
* **uikit:** added video message component and media service ([15713e5](https://github.com/sendbird/sendbird-uikit-react-native/commit/15713e5ca052c5b3a7f5ad6e79ef40252652675d))


### Bug Fixes

* **uikit:** changed type of createExpoNotificationService param ([e030128](https://github.com/sendbird/sendbird-uikit-react-native/commit/e0301285bbd17902bf36e510f142c109aa68858e))


### Documentation

* **uikit:** update README.md ([5c5bbe5](https://github.com/sendbird/sendbird-uikit-react-native/commit/5c5bbe5c36338e0e863e0ef9bc12df88b10b9592))
* **uikit:** update README.md ([3a4b055](https://github.com/sendbird/sendbird-uikit-react-native/commit/3a4b055d73736da9215b0a7c5d01950a6e71997b))


### Improvements

* **chat-hooks:** remove deps from useChannelHandler ([fe4ec27](https://github.com/sendbird/sendbird-uikit-react-native/commit/fe4ec27b1ab6df84aa08fea2e48fb8fb89b943c9))



## [1.0.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0...v1.0.2) (2022-08-09)


### Bug Fixes

* **uikit:** fixed createFileService.expo to work as expected ([876d72c](https://github.com/sendbird/sendbird-uikit-react-native/commit/876d72c2a4f13079e44d55032460a94d04d7c5b3))


### Improvements

* remove React.FC ([303f80b](https://github.com/sendbird/sendbird-uikit-react-native/commit/303f80be04cc4631a6103dad61c4540d9ad7596a))



## [1.0.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0...v1.0.1) (2022-08-09)


### Bug Fixes

* **uikit:** fixed createFileService.expo to work as expected ([876d72c](https://github.com/sendbird/sendbird-uikit-react-native/commit/876d72c2a4f13079e44d55032460a94d04d7c5b3))


### Improvements

* remove React.FC ([303f80b](https://github.com/sendbird/sendbird-uikit-react-native/commit/303f80be04cc4631a6103dad61c4540d9ad7596a))



# [1.0.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.4...v1.0.0) (2022-07-26)

**Note:** Version bump only for package @sendbird/uikit-react-native



# [1.0.0-rc.4](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.3...v1.0.0-rc.4) (2022-07-26)

**Note:** Version bump only for package @sendbird/uikit-react-native



# [1.0.0-rc.3](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.2...v1.0.0-rc.3) (2022-07-26)

**Note:** Version bump only for package @sendbird/uikit-react-native



# [1.0.0-rc.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.1...v1.0.0-rc.2) (2022-07-26)

**Note:** Version bump only for package @sendbird/uikit-react-native



# [1.0.0-rc.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.0...v1.0.0-rc.1) (2022-07-26)

**Note:** Version bump only for package @sendbird/uikit-react-native



# [1.0.0-rc.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v0.1.2...v1.0.0-rc.0) (2022-07-26)


### Bug Fixes

* apply strings review ([a4c94e3](https://github.com/sendbird/sendbird-uikit-react-native/commit/a4c94e380f64919f929c9a494e9fcfb6ba1263cf))
* **chat-hooks:** rename module ([7a2c30c](https://github.com/sendbird/sendbird-uikit-react-native/commit/7a2c30cf136883ef551ae59e9cc848fea81088ff))
* **core:** changed label keys, inject one-source user no name label ([003d46d](https://github.com/sendbird/sendbird-uikit-react-native/commit/003d46d22e3771e6eaec3b2efea79d9715357073))
* **core:** GroupChannelSettings component segmentation ([4bfdfde](https://github.com/sendbird/sendbird-uikit-react-native/commit/4bfdfdea09e75d61b58967586417ad39a2b8aa2a))
* **core:** re-naming GroupChannelInfo to GroupChannelSettings ([afc6e23](https://github.com/sendbird/sendbird-uikit-react-native/commit/afc6e23a90ca8dabc4d684b3b27ab3e5817c7caa))
* **core:** renamed ignoreActiveOnly prop of UserListHeader ([89e80d9](https://github.com/sendbird/sendbird-uikit-react-native/commit/89e80d9672ea20684a4732f2329e26ad4a2f9fb9))
* **core:** renamed onLeaveChannel prop of GroupChannelFragment ([d5aa8f7](https://github.com/sendbird/sendbird-uikit-react-native/commit/d5aa8f7944e35a6bbeecbc02b332a4f51f9fdf2b))
* improve stability ([1698bc1](https://github.com/sendbird/sendbird-uikit-react-native/commit/1698bc19b0c1cc3641c27ef627475ea0355e4e9a))
* improve stability ([72648d1](https://github.com/sendbird/sendbird-uikit-react-native/commit/72648d14e00a01b4c856e7b794a6a22ee7e5b9d7))
* **uikit:** display username as single line ([fad080b](https://github.com/sendbird/sendbird-uikit-react-native/commit/fad080bcdcc40e65f5214082f4f4916bc7661377))
* **uikit:** fragment creator params should be partial ([c53ba95](https://github.com/sendbird/sendbird-uikit-react-native/commit/c53ba95c75396a0fe67dde26f8741d039ac97223))
* **uikit:** prevent crash on open graph ([a5663ca](https://github.com/sendbird/sendbird-uikit-react-native/commit/a5663ca365abf3bb90110d2754fffa299cd3468c))
* **uikit:** remove sdk injection, support better locale type infer ([13dfe9d](https://github.com/sendbird/sendbird-uikit-react-native/commit/13dfe9df6482be97fc9da249d3ea188561cd21f3))
* **uikit:** set keyboardAvoidOffset as a prop ([7679e2f](https://github.com/sendbird/sendbird-uikit-react-native/commit/7679e2fd833d23e9ec8a1ec1f544f8fb2c0e7483))


### Features

* added status component to GroupChannelList ([8ee6ae5](https://github.com/sendbird/sendbird-uikit-react-native/commit/8ee6ae5542c81be173c6329ed6efca5aa1aa8364))
* **uikit:** added error boundary ([952cf9c](https://github.com/sendbird/sendbird-uikit-react-native/commit/952cf9cda612a515d5e7910b6dce81d6c2ee6efb))
* **uikit:** added extension ([52de301](https://github.com/sendbird/sendbird-uikit-react-native/commit/52de301bd8cfa7f660162e0c4951e4db53a3238e))
* **uikit:** added internal local cache storage ([f78a492](https://github.com/sendbird/sendbird-uikit-react-native/commit/f78a492651ea3a2a1e6b4300d6d33c83eac075d0))



## 0.1.2 (2022-04-26)


### Bug Fixes

* fixed channel preview update properly ([b8b3d53](https://github.com/sendbird/sendbird-uikit-react-native/commit/b8b3d536d80b1f15b39e47e428d648da4f513831))
* **foundation:** relocation files ([b0d7426](https://github.com/sendbird/sendbird-uikit-react-native/commit/b0d7426d00153d2dcb136ae9bef5de2bb34ddbe2))


### Features

* added default locale string set ([1c66add](https://github.com/sendbird/sendbird-uikit-react-native/commit/1c66add5f1afc4986b13c4783c738c713136a753))
* added message components ([682cdb4](https://github.com/sendbird/sendbird-uikit-react-native/commit/682cdb433e316f03797b2021c0eba8a313b7cf8e))
* added sample project for real-time development ([e6a9e25](https://github.com/sendbird/sendbird-uikit-react-native/commit/e6a9e25f59368d7f5ea74422fc637e4a354e30e7))
* added storybook ([eddf162](https://github.com/sendbird/sendbird-uikit-react-native/commit/eddf162029268390233d2a2de23fb6f081e3c432))
* added theme typography ([6405333](https://github.com/sendbird/sendbird-uikit-react-native/commit/640533395f0de32cf41bd5330924a3c0a9e38bae))
* added toast ([ddd8de6](https://github.com/sendbird/sendbird-uikit-react-native/commit/ddd8de642cfc911f3c1931edfc6ed94b8dd88b45))
* **chat-hooks:** added enableCollection options to groupChannel hooks ([8fc2454](https://github.com/sendbird/sendbird-uikit-react-native/commit/8fc245485f51feceb2ae7cb0a32ca5cbb9f372d7))
* **core:** added group channel members fragment ([815278d](https://github.com/sendbird/sendbird-uikit-react-native/commit/815278dc4a0a2b679dbcf1992342d9d1756f7453))
* **core:** added message handlers ([2d9f1c4](https://github.com/sendbird/sendbird-uikit-react-native/commit/2d9f1c40d273df9c73b0ad4d8b9d6794af73a576))
* **core:** added typing indicator to group channel ([86d835d](https://github.com/sendbird/sendbird-uikit-react-native/commit/86d835d95034ce20b4471689c603a4f7a7d5a648))
* **core:** implement channel menu to groupChannelList ([debb6d8](https://github.com/sendbird/sendbird-uikit-react-native/commit/debb6d8144c598eb50a124daa5d49641d4bbf1f1))
* **core:** implement send message and file pick flow ([2cc40f8](https://github.com/sendbird/sendbird-uikit-react-native/commit/2cc40f895b59764bd74e8f27513ebb7131721ca1))
* create modularization template script ([ccf022d](https://github.com/sendbird/sendbird-uikit-react-native/commit/ccf022d1da90a88573a1c64c508ad93e22a816d8))
* create type selector ([6139231](https://github.com/sendbird/sendbird-uikit-react-native/commit/6139231e16dc1d78336fb8a1ce0677c43eaf6c30))
* extract foundation package ([41245cc](https://github.com/sendbird/sendbird-uikit-react-native/commit/41245ccff4f76efee2e18e76f34517eb93050798))
* **foundation:** added Badge component ([7b63d90](https://github.com/sendbird/sendbird-uikit-react-native/commit/7b63d90912ce90dbdc7a5cea580f37b4e711d501))
* **foundation:** added Placeholder component ([e68d9a6](https://github.com/sendbird/sendbird-uikit-react-native/commit/e68d9a6f3747930c18b7cb5d8c4c8ec7c7915f47))
* **sample:** added change nickname ([0eceb48](https://github.com/sendbird/sendbird-uikit-react-native/commit/0eceb48b4e365219906a101e7eaa167e498a87ee))
* **sample:** added create channel ([66e7ae9](https://github.com/sendbird/sendbird-uikit-react-native/commit/66e7ae9a035b3b46e58032ba8336bc93fe04131c))
* **sample:** added settings ui ([bb81801](https://github.com/sendbird/sendbird-uikit-react-native/commit/bb818015db8aaafa5ca3b0761b20bf4f1bf1c9fc))
* setup lerna ([#21](https://github.com/sendbird/sendbird-uikit-react-native/issues/21)) ([1382c42](https://github.com/sendbird/sendbird-uikit-react-native/commit/1382c4286c07bcb9a3f8a8c32d757c451610cc76))
* show palette and theme colors to sample app ([1b0cd55](https://github.com/sendbird/sendbird-uikit-react-native/commit/1b0cd5525e8f5716c52fa088a0aa38db36115ced))
* **uikit:** added message receipt ([9cafe11](https://github.com/sendbird/sendbird-uikit-react-native/commit/9cafe11c499196851dea1861eb29bf533737261b))
