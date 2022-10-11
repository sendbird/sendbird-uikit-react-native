# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.0-rc.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.1.2...v2.0.0-rc.0) (2022-10-11)


### ⚠ BREAKING CHANGES

* migrated to Chat SDK v4

### Features

* migrated to Chat SDK v4 ([5ce9e4f](https://github.com/sendbird/sendbird-uikit-react-native/commit/5ce9e4f99bfac790ce66cc13c7e390e578f08713))


### Documentation

* update README ([a1b7452](https://github.com/sendbird/sendbird-uikit-react-native/commit/a1b74524741af306b32736b9338d28ead3769bc7))



## [1.1.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.1.1...v1.1.2) (2022-09-28)


### Bug Fixes

* changed default limit in useGroupChannelListWithCollection hook ([260fa6c](https://github.com/sendbird/sendbird-uikit-react-native/commit/260fa6c802e06f97a669394d9a8331ce961f1019))



## [1.1.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.1.0...v1.1.1) (2022-09-14)


### Features

* **chat-hooks:** added useMessageOutgoingStatus hook ([f3af2a7](https://github.com/sendbird/sendbird-uikit-react-native/commit/f3af2a7e265486a35e209d6353d2b74e7b2c3cba))


### Bug Fixes

* added missing collectionCreator prop to GroupChannelListFragment ([d06d60e](https://github.com/sendbird/sendbird-uikit-react-native/commit/d06d60e76639eb1f68bfef8d63ed1f79e1d3069d))
* **chat-hooks:** respect the order of group channel collection and query. ([913875d](https://github.com/sendbird/sendbird-uikit-react-native/commit/913875db138518fd03648074fe959617ae67b791))



## [1.1.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.2...v1.1.0) (2022-08-31)


### Features

* **uikit:** added TypingIndicator and MessageReceiptStatus in Channel List ([39c54fc](https://github.com/sendbird/sendbird-uikit-react-native/commit/39c54fcfa617def1f2b1dcb05eaa990dd19abc52))


### Improvements

* **chat-hooks:** remove deps from useChannelHandler ([fe4ec27](https://github.com/sendbird/sendbird-uikit-react-native/commit/fe4ec27b1ab6df84aa08fea2e48fb8fb89b943c9))



## [1.0.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0...v1.0.2) (2022-08-09)


### Improvements

* remove React.FC ([303f80b](https://github.com/sendbird/sendbird-uikit-react-native/commit/303f80be04cc4631a6103dad61c4540d9ad7596a))



## [1.0.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0...v1.0.1) (2022-08-09)


### Improvements

* remove React.FC ([303f80b](https://github.com/sendbird/sendbird-uikit-react-native/commit/303f80be04cc4631a6103dad61c4540d9ad7596a))



# [1.0.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.4...v1.0.0) (2022-07-26)

**Note:** Version bump only for package @sendbird/uikit-chat-hooks



# [1.0.0-rc.4](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.3...v1.0.0-rc.4) (2022-07-26)

**Note:** Version bump only for package @sendbird/uikit-chat-hooks



# [1.0.0-rc.3](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.2...v1.0.0-rc.3) (2022-07-26)

**Note:** Version bump only for package @sendbird/uikit-chat-hooks



# [1.0.0-rc.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.1...v1.0.0-rc.2) (2022-07-26)

**Note:** Version bump only for package @sendbird/uikit-chat-hooks



# [1.0.0-rc.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0-rc.0...v1.0.0-rc.1) (2022-07-26)

**Note:** Version bump only for package @sendbird/uikit-chat-hooks



# [1.0.0-rc.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v0.1.2...v1.0.0-rc.0) (2022-07-26)


### Bug Fixes

* **chat-hooks:** do not check isResendable before resend message ([6d3f8a3](https://github.com/sendbird/sendbird-uikit-react-native/commit/6d3f8a37db06aa3e985d1f8fe9137d3c1c60a164))
* **chat-hooks:** rename module ([7a2c30c](https://github.com/sendbird/sendbird-uikit-react-native/commit/7a2c30cf136883ef551ae59e9cc848fea81088ff))
* **core:** renamed ignoreActiveOnly prop of UserListHeader ([89e80d9](https://github.com/sendbird/sendbird-uikit-react-native/commit/89e80d9672ea20684a4732f2329e26ad4a2f9fb9))
* **core:** renamed onLeaveChannel prop of GroupChannelFragment ([d5aa8f7](https://github.com/sendbird/sendbird-uikit-react-native/commit/d5aa8f7944e35a6bbeecbc02b332a4f51f9fdf2b))
* improve stability ([72648d1](https://github.com/sendbird/sendbird-uikit-react-native/commit/72648d14e00a01b4c856e7b794a6a22ee7e5b9d7))



## 0.1.2 (2022-04-26)


### Bug Fixes

* **chat-hooks:** added guard to useGroupChannelListWithQuery init ([5ec16d9](https://github.com/sendbird/sendbird-uikit-react-native/commit/5ec16d927dd1381bb9c2c8cdafc8f7b614cdded5))
* **chat-hooks:** wrong if condition ([4f93e6c](https://github.com/sendbird/sendbird-uikit-react-native/commit/4f93e6c5fde4e4e3c26b214934d9c115f3ce452b))
* fixed channel preview update properly ([b8b3d53](https://github.com/sendbird/sendbird-uikit-react-native/commit/b8b3d536d80b1f15b39e47e428d648da4f513831))
* **utils:** pubsub enhancement ([2006249](https://github.com/sendbird/sendbird-uikit-react-native/commit/2006249e34777293b04dd06f9186cf1436298c6e))


### Features

* added sample project for real-time development ([e6a9e25](https://github.com/sendbird/sendbird-uikit-react-native/commit/e6a9e25f59368d7f5ea74422fc637e4a354e30e7))
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
* **foundation:** added Prompt and Input component ([1bc173a](https://github.com/sendbird/sendbird-uikit-react-native/commit/1bc173af436782a3e6fd34b0d67665d2c44f25ad))
* **sample:** added create channel ([66e7ae9](https://github.com/sendbird/sendbird-uikit-react-native/commit/66e7ae9a035b3b46e58032ba8336bc93fe04131c))
* **sample:** added settings ui ([bb81801](https://github.com/sendbird/sendbird-uikit-react-native/commit/bb818015db8aaafa5ca3b0761b20bf4f1bf1c9fc))
* setup lerna ([#21](https://github.com/sendbird/sendbird-uikit-react-native/issues/21)) ([1382c42](https://github.com/sendbird/sendbird-uikit-react-native/commit/1382c4286c07bcb9a3f8a8c32d757c451610cc76))
* **uikit:** added message receipt ([9cafe11](https://github.com/sendbird/sendbird-uikit-react-native/commit/9cafe11c499196851dea1861eb29bf533737261b))
