# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.0.1...v2.0.2) (2022-12-01)


### ⚠ BREAKING CHANGES

* **uikit:** update camera roll module

### Features

* added group channel type selector ([9fb7a19](https://github.com/sendbird/sendbird-uikit-react-native/commit/9fb7a193b5e245ba89030ef9c9d8abae95cf4bba))
* **foundation:** added profile card ui ([472f02f](https://github.com/sendbird/sendbird-uikit-react-native/commit/472f02f064cbad416661cf49e90c4c9509eb1a4c))
* support broadcast and supergroup channel ([895fa3b](https://github.com/sendbird/sendbird-uikit-react-native/commit/895fa3b27ffb06977fb326610e8234cfb812ec1f))
* **uikit:** added mini profile card ([0877463](https://github.com/sendbird/sendbird-uikit-react-native/commit/08774638ba0e283f6da2c63545be746746b64058))
* **utils:** added buffered request function ([d3e375c](https://github.com/sendbird/sendbird-uikit-react-native/commit/d3e375cc05721c251846d27eb2f8f8e86ad4379f))


### Improvements

* optizmie markAs APIs ([7b8a040](https://github.com/sendbird/sendbird-uikit-react-native/commit/7b8a040b4ffbf2f39a3fe381d53b4790ba897003))
* **uikit:** update camera roll module ([5ddb5d3](https://github.com/sendbird/sendbird-uikit-react-native/commit/5ddb5d33f81d8fdd7b4dd2fa541cd687d5a9bd30))



## [2.0.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.0.0...v2.0.1) (2022-10-26)


### Bug Fixes

* **foundation:** position of toast when keyboard is up on iOS ([bc98b4f](https://github.com/sendbird/sendbird-uikit-react-native/commit/bc98b4f417fc2e784276148078ca02156ef0fb14))
* **uikit:** call setBackgroundState only on background status ([ca89ecc](https://github.com/sendbird/sendbird-uikit-react-native/commit/ca89ecc7305977f584159d2cc9b25498f22f7b0b))



## [2.0.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.0.0-rc.0...v2.0.0) (2022-10-11)


### Documentation

* **resources:** added missing import desc ([1824b65](https://github.com/sendbird/sendbird-uikit-react-native/commit/1824b655850f57dde47f44558477522623a2a1ba))



## [2.0.0-rc.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.1.2...v2.0.0-rc.0) (2022-10-11)


### ⚠ BREAKING CHANGES

* migrated to Chat SDK v4

### Features

* migrated to Chat SDK v4 ([5ce9e4f](https://github.com/sendbird/sendbird-uikit-react-native/commit/5ce9e4f99bfac790ce66cc13c7e390e578f08713))


### Bug Fixes

* **utils:** remove useLayoutEffect sync from useFreshCallback ([d5656be](https://github.com/sendbird/sendbird-uikit-react-native/commit/d5656becb20f5f2927610f87c40b404a2db74516))


### Documentation

* update architecture ([d7c5548](https://github.com/sendbird/sendbird-uikit-react-native/commit/d7c5548fd2322b65493335e7baf0a3692a337bd1))
* update core components ([040dbb4](https://github.com/sendbird/sendbird-uikit-react-native/commit/040dbb442427428e1d522a8adaf802eb073942a9))
* update customization, themese, resources ([1d208ac](https://github.com/sendbird/sendbird-uikit-react-native/commit/1d208ac8babaecc9e43825de5cd810d11b71e298))
* update features ([f3a94e2](https://github.com/sendbird/sendbird-uikit-react-native/commit/f3a94e2178dc5b005679535c3d0b9d1225e22b2d))
* update introduction ([3173e38](https://github.com/sendbird/sendbird-uikit-react-native/commit/3173e3844778005c5405b954d3325267aea4af9c))
* update key functions ([75cc813](https://github.com/sendbird/sendbird-uikit-react-native/commit/75cc8136f490bbd95a02239c6e091cc91ac5c880))
* update README ([a1b7452](https://github.com/sendbird/sendbird-uikit-react-native/commit/a1b74524741af306b32736b9338d28ead3769bc7))



## [1.1.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.1.1...v1.1.2) (2022-09-28)


### Features

* added an alert to go to app settings when permission is not granted (QM-1799) ([dfb9322](https://github.com/sendbird/sendbird-uikit-react-native/commit/dfb9322dc0b1f26e8c0f69f761966f6a2f326e67))


### Bug Fixes

* changed default limit in useGroupChannelListWithCollection hook ([260fa6c](https://github.com/sendbird/sendbird-uikit-react-native/commit/260fa6c802e06f97a669394d9a8331ce961f1019))
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

**Note:** Version bump only for package sendbird-uikit-react-native



# [1.0.0-rc.4](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.3...v1.0.0-rc.4) (2022-07-26)

**Note:** Version bump only for package sendbird-uikit-react-native



# [1.0.0-rc.3](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.2...v1.0.0-rc.3) (2022-07-26)

**Note:** Version bump only for package sendbird-uikit-react-native



# [1.0.0-rc.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.1...v1.0.0-rc.2) (2022-07-26)

**Note:** Version bump only for package sendbird-uikit-react-native



# [1.0.0-rc.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.0...v1.0.0-rc.1) (2022-07-26)

**Note:** Version bump only for package sendbird-uikit-react-native



# [1.0.0-rc.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v0.1.2...v1.0.0-rc.0) (2022-07-26)


### Bug Fixes

* apply strings review ([a4c94e3](https://github.com/sendbird/sendbird-uikit-react-native/commit/a4c94e380f64919f929c9a494e9fcfb6ba1263cf))
* **chat-hooks:** do not check isResendable before resend message ([6d3f8a3](https://github.com/sendbird/sendbird-uikit-react-native/commit/6d3f8a37db06aa3e985d1f8fe9137d3c1c60a164))
* **chat-hooks:** rename module ([7a2c30c](https://github.com/sendbird/sendbird-uikit-react-native/commit/7a2c30cf136883ef551ae59e9cc848fea81088ff))
* **core:** added keyboard-avoid-offset prop to group channel ([bd1c905](https://github.com/sendbird/sendbird-uikit-react-native/commit/bd1c905b334e6e7e13fa367a650a3e8d11395b29))
* **core:** changed label keys ([106843f](https://github.com/sendbird/sendbird-uikit-react-native/commit/106843f3c5e6f665ae3a7d3f9d60ae709942df33))
* **core:** changed label keys, inject one-source user no name label ([003d46d](https://github.com/sendbird/sendbird-uikit-react-native/commit/003d46d22e3771e6eaec3b2efea79d9715357073))
* **core:** conditional rendering for typings indicator string ([64908b9](https://github.com/sendbird/sendbird-uikit-react-native/commit/64908b9ffb1dd26484f7a16e3ab936b10947e653))
* **core:** GroupChannelSettings component segmentation ([4bfdfde](https://github.com/sendbird/sendbird-uikit-react-native/commit/4bfdfdea09e75d61b58967586417ad39a2b8aa2a))
* **core:** iOS media library save type ([55eb549](https://github.com/sendbird/sendbird-uikit-react-native/commit/55eb549ada8771f88954992cf83fb130dd27cd16))
* **core:** NativeFileService error ([ebc71d5](https://github.com/sendbird/sendbird-uikit-react-native/commit/ebc71d5429060eb4f3b9f52749f98ef2888cdb74))
* **core:** NativeFileService, should check file type on iOS ([d07c568](https://github.com/sendbird/sendbird-uikit-react-native/commit/d07c568de01ac80c795435f68ba6e14d0e868a8f))
* **core:** re-naming GroupChannelInfo to GroupChannelSettings ([afc6e23](https://github.com/sendbird/sendbird-uikit-react-native/commit/afc6e23a90ca8dabc4d684b3b27ab3e5817c7caa))
* **core:** renamed ignoreActiveOnly prop of UserListHeader ([89e80d9](https://github.com/sendbird/sendbird-uikit-react-native/commit/89e80d9672ea20684a4732f2329e26ad4a2f9fb9))
* **core:** renamed onLeaveChannel prop of GroupChannelFragment ([d5aa8f7](https://github.com/sendbird/sendbird-uikit-react-native/commit/d5aa8f7944e35a6bbeecbc02b332a4f51f9fdf2b))
* improve stability ([1698bc1](https://github.com/sendbird/sendbird-uikit-react-native/commit/1698bc19b0c1cc3641c27ef627475ea0355e4e9a))
* improve stability ([72648d1](https://github.com/sendbird/sendbird-uikit-react-native/commit/72648d14e00a01b4c856e7b794a6a22ee7e5b9d7))
* renamed Context to Contexts ([41bae55](https://github.com/sendbird/sendbird-uikit-react-native/commit/41bae55059d8eb79e9d9656a5a43703c495ab75f))
* **sample:** badge clear ([df069b0](https://github.com/sendbird/sendbird-uikit-react-native/commit/df069b02ecb8e43156422e0e63f26cce88c59e2b))
* **sample:** push handler ([6505495](https://github.com/sendbird/sendbird-uikit-react-native/commit/6505495ee3ac059afcbf763fdc8458eb6d0e107c))
* **sample:** revert gradle settings ([c29a87f](https://github.com/sendbird/sendbird-uikit-react-native/commit/c29a87fd79e3541667fa17cd2f1d74dd4702f7f8))
* **sample:** underscore numeral throw error on android build ([ff3b6da](https://github.com/sendbird/sendbird-uikit-react-native/commit/ff3b6da4b9679788eb0161edebff609b279dcb3f))
* **sample:** update notifee ([a54048c](https://github.com/sendbird/sendbird-uikit-react-native/commit/a54048c878f1c5d7bc7f390660cfba9a431d04be))
* **uikit:** display username as single line ([fad080b](https://github.com/sendbird/sendbird-uikit-react-native/commit/fad080bcdcc40e65f5214082f4f4916bc7661377))
* **uikit:** fragment creator params should be partial ([c53ba95](https://github.com/sendbird/sendbird-uikit-react-native/commit/c53ba95c75396a0fe67dde26f8741d039ac97223))
* **uikit:** prevent crash on open graph ([a5663ca](https://github.com/sendbird/sendbird-uikit-react-native/commit/a5663ca365abf3bb90110d2754fffa299cd3468c))
* **uikit:** remove sdk injection, support better locale type infer ([13dfe9d](https://github.com/sendbird/sendbird-uikit-react-native/commit/13dfe9df6482be97fc9da249d3ea188561cd21f3))
* **uikit:** set keyboardAvoidOffset as a prop ([7679e2f](https://github.com/sendbird/sendbird-uikit-react-native/commit/7679e2fd833d23e9ec8a1ec1f544f8fb2c0e7483))
* update sdk, fix locale injection ([a86ad81](https://github.com/sendbird/sendbird-uikit-react-native/commit/a86ad81f05ebbd42dd65f1ae0919e4459cbb9439))
* **util:** url replacer ([07753b1](https://github.com/sendbird/sendbird-uikit-react-native/commit/07753b19547d13f8a76c2850009ae71fda20aa27))


### Features

* added status component to GroupChannelList ([8ee6ae5](https://github.com/sendbird/sendbird-uikit-react-native/commit/8ee6ae5542c81be173c6329ed6efca5aa1aa8364))
* **foundation:** added typography option to themeFactory ([28b47d5](https://github.com/sendbird/sendbird-uikit-react-native/commit/28b47d58ebc83821060f0a091bf80de75d21a62f))
* **uikit:** added error boundary ([952cf9c](https://github.com/sendbird/sendbird-uikit-react-native/commit/952cf9cda612a515d5e7910b6dce81d6c2ee6efb))
* **uikit:** added extension ([52de301](https://github.com/sendbird/sendbird-uikit-react-native/commit/52de301bd8cfa7f660162e0c4951e4db53a3238e))
* **uikit:** added internal local cache storage ([f78a492](https://github.com/sendbird/sendbird-uikit-react-native/commit/f78a492651ea3a2a1e6b4300d6d33c83eac075d0))



## 0.1.2 (2022-04-26)


### Bug Fixes

* added ios env checker ([d42d0ac](https://github.com/sendbird/sendbird-uikit-react-native/commit/d42d0acf4b1d9e26044ea5e0d1db3c722ef700fb))
* android build command typo ([2f81938](https://github.com/sendbird/sendbird-uikit-react-native/commit/2f819387417f2dfe1f0d17e398c87d68dfa6775a))
* android service account path ([dfec8fc](https://github.com/sendbird/sendbird-uikit-react-native/commit/dfec8fc45a2db02e822f74cabd95d8f6a23b9e7f))
* changed ios match git authorization method to ssh ([a293a75](https://github.com/sendbird/sendbird-uikit-react-native/commit/a293a75345fc23f8cc06e2c6a0f040df657eb64a))
* **chat-hooks:** added guard to useGroupChannelListWithQuery init ([5ec16d9](https://github.com/sendbird/sendbird-uikit-react-native/commit/5ec16d927dd1381bb9c2c8cdafc8f7b614cdded5))
* **chat-hooks:** wrong if condition ([4f93e6c](https://github.com/sendbird/sendbird-uikit-react-native/commit/4f93e6c5fde4e4e3c26b214934d9c115f3ce452b))
* **core:** added performance warning and create patch to sample ([c366f28](https://github.com/sendbird/sendbird-uikit-react-native/commit/c366f28a1aea06d896a753a47df88c67e81e5bdc))
* **core:** exports expo platform service creators ([c98f776](https://github.com/sendbird/sendbird-uikit-react-native/commit/c98f776d41040cdd11cc159dcdb2e7449b91106c))
* **core:** fixed landscape layout ([3d2ce2d](https://github.com/sendbird/sendbird-uikit-react-native/commit/3d2ce2d4249b197d81e4bb241b63e9014a5654fc))
* fixed channel preview update properly ([b8b3d53](https://github.com/sendbird/sendbird-uikit-react-native/commit/b8b3d536d80b1f15b39e47e428d648da4f513831))
* fixed pod version ([944253e](https://github.com/sendbird/sendbird-uikit-react-native/commit/944253e3958734bf307e12f9278e2ed31f2aa67d))
* **foundation:** added max-width to toast ([740a16b](https://github.com/sendbird/sendbird-uikit-react-native/commit/740a16b0efe58b2804c0f81f49f3b146824d9732))
* **foundation:** export Switch component ([1af53a6](https://github.com/sendbird/sendbird-uikit-react-native/commit/1af53a64b728469b232727e67cd38b070fe9fe7b))
* **foundation:** implement android modal onDismiss ([0c82d60](https://github.com/sendbird/sendbird-uikit-react-native/commit/0c82d60c8429ec35b8bde13a9caf1ffc8fbdff66))
* **foundation:** position of keyboard avoided modal is incorrect when orientation is changed on android ([b63ce2c](https://github.com/sendbird/sendbird-uikit-react-native/commit/b63ce2c69eb36d3b8207009d83794d1912badfe2))
* **foundation:** relocation files ([b0d7426](https://github.com/sendbird/sendbird-uikit-react-native/commit/b0d7426d00153d2dcb136ae9bef5de2bb34ddbe2))
* ios fastlane env ([09f042c](https://github.com/sendbird/sendbird-uikit-react-native/commit/09f042c84e6cb42ec1c0366c3c0942f0defddadd))
* ios pods cache dir path ([841f5b3](https://github.com/sendbird/sendbird-uikit-react-native/commit/841f5b3c98177c5f8d05de281dc59aa74445bffb))
* lint warnings ([caeff54](https://github.com/sendbird/sendbird-uikit-react-native/commit/caeff5405451745466d87546b104a84848ff3a7e))
* nvm error on ios build phase ([5d724aa](https://github.com/sendbird/sendbird-uikit-react-native/commit/5d724aa58cd185528aefba7b1cb7a5d29acf1b36))
* oom on android build ([15c2f4b](https://github.com/sendbird/sendbird-uikit-react-native/commit/15c2f4b96a72cc747cc6276f32012d717f3def98))
* remove default storybook components ([e6eca26](https://github.com/sendbird/sendbird-uikit-react-native/commit/e6eca269df4641faf5ebb8a0f91be2e0aa000324))
* **sample:** fix storybook path ([91c0d4f](https://github.com/sendbird/sendbird-uikit-react-native/commit/91c0d4f4ea250986ab6e3eacb49f7006d41e32c0))
* **sample:** grouping stories ([513ca25](https://github.com/sendbird/sendbird-uikit-react-native/commit/513ca25a5e3e3072a312b37194c53ec89c1a82c8))
* update ruby ([fcd85f0](https://github.com/sendbird/sendbird-uikit-react-native/commit/fcd85f0bfca02228a0b928ce034c6270e4311d89))
* **utils:** added react-native dependency ([d6ccf01](https://github.com/sendbird/sendbird-uikit-react-native/commit/d6ccf019f9722c664d2ba00befe53c455466d244))
* **utils:** pubsub enhancement ([2006249](https://github.com/sendbird/sendbird-uikit-react-native/commit/2006249e34777293b04dd06f9186cf1436298c6e))


### Features

* added android ([ec60009](https://github.com/sendbird/sendbird-uikit-react-native/commit/ec60009f6e6d72451ab4add3bf0bda96c9bf4211))
* added default locale string set ([1c66add](https://github.com/sendbird/sendbird-uikit-react-native/commit/1c66add5f1afc4986b13c4783c738c713136a753))
* added ESBuild to sample metro bundler minifier ([a54de63](https://github.com/sendbird/sendbird-uikit-react-native/commit/a54de63f51f05026c4eb91c3e435c040ee8dcb56))
* added ios ([520d769](https://github.com/sendbird/sendbird-uikit-react-native/commit/520d769490e0388a32a1a2e8f816b3eb52bd61fa))
* added message components ([682cdb4](https://github.com/sendbird/sendbird-uikit-react-native/commit/682cdb433e316f03797b2021c0eba8a313b7cf8e))
* added sample project for real-time development ([e6a9e25](https://github.com/sendbird/sendbird-uikit-react-native/commit/e6a9e25f59368d7f5ea74422fc637e4a354e30e7))
* added storybook ([eddf162](https://github.com/sendbird/sendbird-uikit-react-native/commit/eddf162029268390233d2a2de23fb6f081e3c432))
* added theme typography ([6405333](https://github.com/sendbird/sendbird-uikit-react-native/commit/640533395f0de32cf41bd5330924a3c0a9e38bae))
* added toast ([ddd8de6](https://github.com/sendbird/sendbird-uikit-react-native/commit/ddd8de642cfc911f3c1931edfc6ed94b8dd88b45))
* **chat-hooks:** added channel list local cache hook ([77685bc](https://github.com/sendbird/sendbird-uikit-react-native/commit/77685bcd88b8442b13b7d48cde89960442162be6))
* **chat-hooks:** added enableCollection options to groupChannel hooks ([8fc2454](https://github.com/sendbird/sendbird-uikit-react-native/commit/8fc245485f51feceb2ae7cb0a32ca5cbb9f372d7))
* **core:** added group channel members fragment ([815278d](https://github.com/sendbird/sendbird-uikit-react-native/commit/815278dc4a0a2b679dbcf1992342d9d1756f7453))
* **core:** added message handlers ([2d9f1c4](https://github.com/sendbird/sendbird-uikit-react-native/commit/2d9f1c40d273df9c73b0ad4d8b9d6794af73a576))
* **core:** added typing indicator to group channel ([86d835d](https://github.com/sendbird/sendbird-uikit-react-native/commit/86d835d95034ce20b4471689c603a4f7a7d5a648))
* **core:** implement channel menu to groupChannelList ([debb6d8](https://github.com/sendbird/sendbird-uikit-react-native/commit/debb6d8144c598eb50a124daa5d49641d4bbf1f1))
* **core:** implement send message and file pick flow ([2cc40f8](https://github.com/sendbird/sendbird-uikit-react-native/commit/2cc40f895b59764bd74e8f27513ebb7131721ca1))
* create modularization template script ([ccf022d](https://github.com/sendbird/sendbird-uikit-react-native/commit/ccf022d1da90a88573a1c64c508ad93e22a816d8))
* create type selector ([6139231](https://github.com/sendbird/sendbird-uikit-react-native/commit/6139231e16dc1d78336fb8a1ce0677c43eaf6c30))
* extract foundation package ([41245cc](https://github.com/sendbird/sendbird-uikit-react-native/commit/41245ccff4f76efee2e18e76f34517eb93050798))
* **foundation:** added Avatar component ([0e451c3](https://github.com/sendbird/sendbird-uikit-react-native/commit/0e451c301ba51ae0bff7bb8cb576dbda79dcaeed))
* **foundation:** added Badge component ([7b63d90](https://github.com/sendbird/sendbird-uikit-react-native/commit/7b63d90912ce90dbdc7a5cea580f37b4e711d501))
* **foundation:** added BottomSheet component ([c208710](https://github.com/sendbird/sendbird-uikit-react-native/commit/c208710eea9f8a7c165fa7af820a1972965cb75e))
* **foundation:** added dialogue ([e2c4abc](https://github.com/sendbird/sendbird-uikit-react-native/commit/e2c4abc6bb56aecebefbc11a041539707eb48a83))
* **foundation:** added Placeholder component ([e68d9a6](https://github.com/sendbird/sendbird-uikit-react-native/commit/e68d9a6f3747930c18b7cb5d8c4c8ec7c7915f47))
* **foundation:** added Prompt and Input component ([1bc173a](https://github.com/sendbird/sendbird-uikit-react-native/commit/1bc173af436782a3e6fd34b0d67665d2c44f25ad))
* **foundation:** implement gesture to slide type modal ([cc5af93](https://github.com/sendbird/sendbird-uikit-react-native/commit/cc5af93279bd6f13569daac5f9d83c4ef8c0e419))
* **foundation:** implement queued dialogs (action menu, alert) ([e5e7b24](https://github.com/sendbird/sendbird-uikit-react-native/commit/e5e7b2485c1e50391db602e05b35cabe282c7982))
* **sample:** added change nickname ([0eceb48](https://github.com/sendbird/sendbird-uikit-react-native/commit/0eceb48b4e365219906a101e7eaa167e498a87ee))
* **sample:** added change profile photo ([74ea450](https://github.com/sendbird/sendbird-uikit-react-native/commit/74ea450fc061212e3ba9d43910dbfcac96e98c89))
* **sample:** added create channel ([66e7ae9](https://github.com/sendbird/sendbird-uikit-react-native/commit/66e7ae9a035b3b46e58032ba8336bc93fe04131c))
* **sample:** added ios notification ([44ef9f7](https://github.com/sendbird/sendbird-uikit-react-native/commit/44ef9f70cd2bc38ba605c5fd8bf4e1d70cfe03d2))
* **sample:** added settings ui ([bb81801](https://github.com/sendbird/sendbird-uikit-react-native/commit/bb818015db8aaafa5ca3b0761b20bf4f1bf1c9fc))
* setup lerna ([#21](https://github.com/sendbird/sendbird-uikit-react-native/issues/21)) ([1382c42](https://github.com/sendbird/sendbird-uikit-react-native/commit/1382c4286c07bcb9a3f8a8c32d757c451610cc76))
* show palette and theme colors to sample app ([1b0cd55](https://github.com/sendbird/sendbird-uikit-react-native/commit/1b0cd5525e8f5716c52fa088a0aa38db36115ced))
* **uikit:** added message receipt ([9cafe11](https://github.com/sendbird/sendbird-uikit-react-native/commit/9cafe11c499196851dea1861eb29bf533737261b))
