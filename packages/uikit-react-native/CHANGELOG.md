# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.7.5](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.7.4...v3.7.5) (2024-10-29)

### Features

- add scrolling for streaming message update ([c4924bc](https://github.com/sendbird/sendbird-uikit-react-native/commit/c4924bcfacb0279a0b7542fce7d7ca8dda5bcc55))

### Bug Fixes

- ensure image visibility in file viewer on new architecture ([ec6834b](https://github.com/sendbird/sendbird-uikit-react-native/commit/ec6834bafd5b59d6797a5af6987cb13499e0c577))
- remove non-required permissions from android ([4646e34](https://github.com/sendbird/sendbird-uikit-react-native/commit/4646e34df83272607326894f5e225b03cac91a6d))
- resolve this binding issues ([c4561a0](https://github.com/sendbird/sendbird-uikit-react-native/commit/c4561a0c87b372cf69a53b6ecd7312ef3337ee95))

## [3.7.4](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.7.3...v3.7.4) (2024-10-22)

### Bug Fixes

- added try/catch to unhandled errors ([5df59ce](https://github.com/sendbird/sendbird-uikit-react-native/commit/5df59ce065587ccb7dc03e4cc9ed377a8f354766))
- remove default onOpenFileURL handler ([2ad2275](https://github.com/sendbird/sendbird-uikit-react-native/commit/2ad22753bd553c5061cf33624daf4b97af272588))

## [3.7.3](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.7.2...v3.7.3) (2024-10-15)

### Bug Fixes

- await token apis ([cdc1b4c](https://github.com/sendbird/sendbird-uikit-react-native/commit/cdc1b4cde6430f8c4f654edc918bb5ac7f07a22c))

## [3.7.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.7.1...v3.7.2) (2024-09-25)

### Features

- add sbu handlers interface ([0e75d81](https://github.com/sendbird/sendbird-uikit-react-native/commit/0e75d8101e718f560812a843f565d80875c44767))

## [3.7.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.7.0...v3.7.1) (2024-09-10)

### Bug Fixes

- disconnect ws only on unmounted ([5f09729](https://github.com/sendbird/sendbird-uikit-react-native/commit/5f0972962d437f6a34c70698ef3aa2d9df6af69e))

## [3.7.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.6.0...v3.7.0) (2024-08-08)

### Features

- support mmkv storage and deprecate a async storage ([ffbb8fc](https://github.com/sendbird/sendbird-uikit-react-native/commit/ffbb8fcc0434f914355cb28a9d522c6e276a6f7c))
- updated sample React version to 0.74.3 ([0e32587](https://github.com/sendbird/sendbird-uikit-react-native/commit/0e32587b51b07b160c72d393e044fb6532867d1f))

## [3.6.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.5.4...v3.6.0) (2024-07-09)

### Features

- added thread type in GroupChannel ([5e815ea](https://github.com/sendbird/sendbird-uikit-react-native/commit/5e815ea73efec563c50844ece052fae0fb0694b7))

## [3.5.4](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.5.3...v3.5.4) (2024-06-13)

### ⚠ BREAKING CHANGES

- deprecated enableReactionsSupergroup in SendbirdUIKitContainerProps

### Features

- deprecated enableReactionsSupergroup in SendbirdUIKitContainerProps ([b90d2e2](https://github.com/sendbird/sendbird-uikit-react-native/commit/b90d2e2ed8e13e35729a5c77775529e2380093da))

## [3.5.3](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.5.2...v3.5.3) (2024-05-28)

### Bug Fixes

- when frozen or muted, input should be disabled ([712ae97](https://github.com/sendbird/sendbird-uikit-react-native/commit/712ae97bdff6f4ed3d77562d6a2537d40d85e059))

## [3.5.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.5.1...v3.5.2) (2024-04-23)

### Features

- inputDisabled prop opened as public ([6eb4ad0](https://github.com/sendbird/sendbird-uikit-react-native/commit/6eb4ad0d35447183a697c2c8c5064a003c1e6f9a))

## [3.5.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.5.0...v3.5.1) (2024-04-08)

### Bug Fixes

- remove unused ios media library permission ([0a65f4f](https://github.com/sendbird/sendbird-uikit-react-native/commit/0a65f4f1b743fffa0a3c2bbb488978f32a02d977))

## [3.5.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.4.3...v3.5.0) (2024-03-26)

### Features

- support reactions for super group channel ([8ab0720](https://github.com/sendbird/sendbird-uikit-react-native/commit/8ab07205c6bda1b9fe8c61153288ab6a6534dfca))

## [3.4.3](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.4.2...v3.4.3) (2024-03-20)

**Note:** Version bump only for package @sendbird/uikit-react-native

## [3.4.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.4.1...v3.4.2) (2024-03-06)

### Bug Fixes

- remove conditional hooks even if they depend on an unchanging value. ([d61e137](https://github.com/sendbird/sendbird-uikit-react-native/commit/d61e13790fc8e5ec50d430d423b66f1f2d9240fe))

## [3.4.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.4.0...v3.4.1) (2024-02-06)

### Bug Fixes

- use ComponentType instead of function structure in CommonComponent type ([2cf00e9](https://github.com/sendbird/sendbird-uikit-react-native/commit/2cf00e933e09c5ce8e138c36188c0123e5100abe))

## [3.4.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.3.0...v3.4.0) (2024-01-30)

### Features

- implement zoomable image viewer to FileViewer ([06a4f95](https://github.com/sendbird/sendbird-uikit-react-native/commit/06a4f95b8d7d7b6f574f2d3a4ea15aebbad6e55b))

### Bug Fixes

- replace padding horizontal and vertical ([24f49b4](https://github.com/sendbird/sendbird-uikit-react-native/commit/24f49b4c5631f8a2bf940f3570afa5488d94dd12))

## [3.3.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.2.0...v3.3.0) (2023-11-23)

### Features

- add bottomSheetItem to props of renderMessage ([83f8710](https://github.com/sendbird/sendbird-uikit-react-native/commit/83f87108321a8c6a532afa5f24e40d95a6552a36))
- add typing indicator bubble ui and logic ([9223b43](https://github.com/sendbird/sendbird-uikit-react-native/commit/9223b438f78d8b63da778c3c74329bdb383ba997))

### Bug Fixes

- add promise polyfills for hermes ([2f31a45](https://github.com/sendbird/sendbird-uikit-react-native/commit/2f31a4562aefcfb26e81d2525340857e9456ab4c))
- adjust lineHeight of iOS TextInput ([c9c253e](https://github.com/sendbird/sendbird-uikit-react-native/commit/c9c253e5d2b863c87c22f4439e0bac6e9a9187de))
- if the bubble renders and the scroll reaches the bottom, it should scroll to bottom on android ([a866422](https://github.com/sendbird/sendbird-uikit-react-native/commit/a866422b715b179337b11a6e8079c7c765a03a9d))

## [3.2.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.1.2...v3.2.0) (2023-11-03)

### Features

- add chat init params to chatOptions ([7742853](https://github.com/sendbird/sendbird-uikit-react-native/commit/7742853837959884feb1e577e4682802486efb9f))
- add createRecordFilePath method to FileServiceInterface ([0b7fd40](https://github.com/sendbird/sendbird-uikit-react-native/commit/0b7fd40faaf12721dfc84cb90fdbc8040e4ea951))
- add reaction.onPressUserProfile to SendbirdUIKitContainer props ([379bcce](https://github.com/sendbird/sendbird-uikit-react-native/commit/379bcce0bb4f123108bec86e6decdfe93b3c3718))
- add scrollToMessage to group channel contexts ([df48e2c](https://github.com/sendbird/sendbird-uikit-react-native/commit/df48e2c3a20abecc3577aa59748b18500c61236e))
- add string set for microphone permission ([9e9c2e1](https://github.com/sendbird/sendbird-uikit-react-native/commit/9e9c2e177932fb0ae7034cd932d2bbb7d5af9eed))
- add string set for muted and frozen when sending a voice message ([0c8d1f5](https://github.com/sendbird/sendbird-uikit-react-native/commit/0c8d1f561e0a8a1685363851529a5eeff52426d3))
- add voice message config to uikit container ([6f5de2c](https://github.com/sendbird/sendbird-uikit-react-native/commit/6f5de2c7e100d08f56de58047f9e865bcfe5121e))
- add yalc for local deployment ([7778d67](https://github.com/sendbird/sendbird-uikit-react-native/commit/7778d67c97dda62be02e2ac7c9390864549ef53a))
- **foundation:** add progress bar component ([af6a2fb](https://github.com/sendbird/sendbird-uikit-react-native/commit/af6a2fb4424f99b2fc46ff8dc8e6a3f74be08c86))
- **foundation:** add voice message input color set ([b94d230](https://github.com/sendbird/sendbird-uikit-react-native/commit/b94d230b6947aa2b46f59ced77e2bbb505cb5bfc))
- implement cli player service ([b136de4](https://github.com/sendbird/sendbird-uikit-react-native/commit/b136de4ebaa32cc0651ee9a66f9598454d8adac2))
- implement cli recorder service ([e05cf93](https://github.com/sendbird/sendbird-uikit-react-native/commit/e05cf93754900675dae71d2d542701488df8afdd))
- implement recorder and player service for expo ([851ec0e](https://github.com/sendbird/sendbird-uikit-react-native/commit/851ec0efbff989da6becf9938dbf5a2bd8efcc69))
- implement voice message input ([9e6bc75](https://github.com/sendbird/sendbird-uikit-react-native/commit/9e6bc7551d0e28d020fc04599a833c0dd34bcd80))
- implement voice message logic ([337d022](https://github.com/sendbird/sendbird-uikit-react-native/commit/337d0228fd1fc593c12d886aa8bd776d5666a4bc))

### Bug Fixes

- await onClose for voice message input before displaying permission alert ([62ef277](https://github.com/sendbird/sendbird-uikit-react-native/commit/62ef277069a057bb4e5ee6331b2bcb9320bb6c7b))
- **CLNP-983:** display a message unavailable text if the message is not accessible ([e38512a](https://github.com/sendbird/sendbird-uikit-react-native/commit/e38512aeece12c32aea2c56b7a7a9ed49bc6f7bb))
- **CLNP-983:** search for messages from an accessible range ([b025f7f](https://github.com/sendbird/sendbird-uikit-react-native/commit/b025f7f771e8c335101651aebb97380be9516c36))
- reset player and recorder if input closed with back button press ([e8e43ec](https://github.com/sendbird/sendbird-uikit-react-native/commit/e8e43ec727f9cd2483bd3a82ed00984560c983aa))
- **UIKIT-4452:** uikit configuration should always be initialized ([1e539bb](https://github.com/sendbird/sendbird-uikit-react-native/commit/1e539bbdd3ee332a0d1f7eee839d77a9972b4b4e))

### Improvements

- lift up the flatListRef to the provider and created MessageList context ([4a6efdc](https://github.com/sendbird/sendbird-uikit-react-native/commit/4a6efdcf71ce8659f1de5ea90a34be630e47df55))

## [3.1.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.1.1...v3.1.2) (2023-10-04)

### Features

- add localCacheEncryption interface to container prop ([3341992](https://github.com/sendbird/sendbird-uikit-react-native/commit/33419920352375ad7df08c19d32449179d2e52e9))

### Bug Fixes

- filter deactivated users when making mention suggestions ([ee1e9c2](https://github.com/sendbird/sendbird-uikit-react-native/commit/ee1e9c24683cb93430a4b242a6bc667140c3fc27))

## [3.1.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.1.0...v3.1.1) (2023-08-23)

### Features

- use thumbnails if available ([62f3ca0](https://github.com/sendbird/sendbird-uikit-react-native/commit/62f3ca0b209c5362bd335dbe22619dc053509fda))

## [3.1.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.0.4...v3.1.0) (2023-08-11)

### Features

- add video thumbnail component ([e702155](https://github.com/sendbird/sendbird-uikit-react-native/commit/e7021559b1bb08d17710c8889a467fd87a1f1395))
- **UIKIT-4240:** implement basic quote reply logic ([#103](https://github.com/sendbird/sendbird-uikit-react-native/issues/103)) ([b4add0e](https://github.com/sendbird/sendbird-uikit-react-native/commit/b4add0eba112c3cde32f893c63812dbffd48a530))

### Bug Fixes

- add exception handling for unreachable parent message ([9df42be](https://github.com/sendbird/sendbird-uikit-react-native/commit/9df42be2e9e725834e31e63472bbff5f35adb75a))

## [3.0.4](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.0.3...v3.0.4) (2023-07-13)

### Features

- update expo-document-picker and support backward compatibility ([364f805](https://github.com/sendbird/sendbird-uikit-react-native/commit/364f805aa9c060d62eae8805121e29a5bddc3bec))

## [3.0.3](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.0.2...v3.0.3) (2023-07-11)

### Bug Fixes

- **utils:** wrong mime type check condition in normalizeFile ([1ca3789](https://github.com/sendbird/sendbird-uikit-react-native/commit/1ca378905d990769b836bcb4787d7da13e57a10e))

## [3.0.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.0.1...v3.0.2) (2023-07-10)

### Bug Fixes

- revert "fix: do not use scrollview enhancer if the platform is not android (ff48e36)" ([907b09e](https://github.com/sendbird/sendbird-uikit-react-native/commit/907b09e3a71821b5d47e24d28e3ef429982a2f9b))

## [3.0.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v3.0.0...v3.0.1) (2023-07-04)

### Bug Fixes

- do not use scrollview enhancer if the platform is not android ([ff48e36](https://github.com/sendbird/sendbird-uikit-react-native/commit/ff48e36cf1fec3f5ede856360ac05b1523398834))
- update expo modules and support backward compatibility ([5c45ee6](https://github.com/sendbird/sendbird-uikit-react-native/commit/5c45ee6ab025505633a09ea345e6cbc5be7b584b))

## [3.0.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.5.0...v3.0.0) (2023-06-28)

### ⚠ BREAKING CHANGES

- update signature of channel preview prop in group channel list and open channel list
- removed queryCreator from the group channel and group channel list
- update minimum chat sdk version
- bumped peer dependency version of chat sdk
- react-native minimum version changed to 0.65.0 from 0.63.3
- made `chatOptions.localCacheStorage` of `SendbirdUIKitContainer` required
- deprecated item removal in ChannelInput
- deprecated MessageRenderer removal (replaced to GroupChannelMessageRenderer)
- deprecated item removal in ChannelMessageList
- deprecated item removal in uikit-chat-hooks package
- deprecated item removal in StringSet

### Features

- added AttachmentsButton to ChannelInput component ([687f3a0](https://github.com/sendbird/sendbird-uikit-react-native/commit/687f3a061e0d8eb234cd055f1e1a6735fb8f95e3))
- bumped peer dependency version of chat sdk ([a57aff0](https://github.com/sendbird/sendbird-uikit-react-native/commit/a57aff007789a00474cbf16f2c4158fa0327b507))
- deprecated item removal in ChannelInput ([6a326ca](https://github.com/sendbird/sendbird-uikit-react-native/commit/6a326ca38c5cc957b1a1fdf4b7e3aecd3171a9d1))
- deprecated item removal in ChannelMessageList ([3a68a33](https://github.com/sendbird/sendbird-uikit-react-native/commit/3a68a33995c51b96f8966cf9aaf1f97126e3ec55))
- deprecated item removal in StringSet ([956236b](https://github.com/sendbird/sendbird-uikit-react-native/commit/956236bf19e9774b9454dba2c823b0fe20bb920c))
- deprecated item removal in uikit-chat-hooks package ([48fabfe](https://github.com/sendbird/sendbird-uikit-react-native/commit/48fabfe10b4844c595d4e44b4600637f7d473616))
- deprecated MessageRenderer removal (replaced to GroupChannelMessageRenderer) ([488e0b6](https://github.com/sendbird/sendbird-uikit-react-native/commit/488e0b6d9774045e1abcba35a6fa47770156e49f))
- hide ui elements when the channel is ephemeral ([eacc2da](https://github.com/sendbird/sendbird-uikit-react-native/commit/eacc2dad02271d17b26071c716d41bcdfead1957))
- made `chatOptions.localCacheStorage` of `SendbirdUIKitContainer` required ([2f07d0d](https://github.com/sendbird/sendbird-uikit-react-native/commit/2f07d0db05e8c101807dd1205544242efe3a0371))
- react-native minimum version changed to 0.65.0 from 0.63.3 ([39a9852](https://github.com/sendbird/sendbird-uikit-react-native/commit/39a9852c737dbbe5e034a895deae791b3cb1f9b8))
- support options for default user profile(default: false) ([6671a61](https://github.com/sendbird/sendbird-uikit-react-native/commit/6671a61a293403b0becdea030326520829662ac6))
- support options for ogtag in channel ([d80b8a0](https://github.com/sendbird/sendbird-uikit-react-native/commit/d80b8a0dc58a60e66c6ce63cc850e08face51416))
- update minimum chat sdk version ([5330d1f](https://github.com/sendbird/sendbird-uikit-react-native/commit/5330d1fb533a614f7edb1614cc379c842768e4cf))
- use uikitWithAppInfo internally ([a182ead](https://github.com/sendbird/sendbird-uikit-react-native/commit/a182ead2a1d59bffa7078ed5baa1be6124fce798))

### Bug Fixes

- ensure correct display of reply messages when replyType is configured in uikit configs ([a00b089](https://github.com/sendbird/sendbird-uikit-react-native/commit/a00b089f204ba222be1c3cdc22002655ace275b7))
- fixed config linking in mention manager ([6e8ba6c](https://github.com/sendbird/sendbird-uikit-react-native/commit/6e8ba6cfae3f93ab53b5dfcf93c08fa8378c026c))
- fixed menuItemsCreator timing ([279fd98](https://github.com/sendbird/sendbird-uikit-react-native/commit/279fd98867c5c2bf94b9bbe466b857ef231c1d17))
- fixed onPress related handlers in message renderer for proper functionality ([6da20db](https://github.com/sendbird/sendbird-uikit-react-native/commit/6da20db542d524eb83637de71c737fcc2d0627ca))
- focusing animation of message search results has been modified to apply only to the message component ([c5d22a2](https://github.com/sendbird/sendbird-uikit-react-native/commit/c5d22a2f0a743904c9559bcc6c34ab6fc010627d))
- replaced unsupported Object.hasOwn ([f165273](https://github.com/sendbird/sendbird-uikit-react-native/commit/f165273e6fe44707a87f15d5cefde1c110abdea2))

### Miscellaneous Chores

- removed queryCreator from the group channel and group channel list ([ca3bc98](https://github.com/sendbird/sendbird-uikit-react-native/commit/ca3bc98c699e7c4a0e17b555fe4e249d218b922b))
- update signature of channel preview prop in group channel list and open channel list ([d3e8afa](https://github.com/sendbird/sendbird-uikit-react-native/commit/d3e8afa475178b3b2ef9c2ae8a4172c4663c7acc))

### Improvements

- react-native-scrollview-enhancer handle as a optional ([d570851](https://github.com/sendbird/sendbird-uikit-react-native/commit/d57085117d4af5deaf4fc7a90bdc631ad1e2dad2))

## [2.5.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.4.2...v2.5.0) (2023-05-04)

### Features

- added message search fragment ([a6342c0](https://github.com/sendbird/sendbird-uikit-react-native/commit/a6342c09c2007ac2372f4a630499382aae34d6de))
- implement focus animation on search item ([7fe38e8](https://github.com/sendbird/sendbird-uikit-react-native/commit/7fe38e8b6cc3ce436b117bc72dada85d5b83fb2d))
- implemented scroll-view enhancer ([1dca4a0](https://github.com/sendbird/sendbird-uikit-react-native/commit/1dca4a062b45bffc781beec88c311cb6d83463fe))

### Bug Fixes

- **uikit:** do not handle onUserBanned in open channel list ([8ba9daa](https://github.com/sendbird/sendbird-uikit-react-native/commit/8ba9daaa2f56076d00761f684c890292d5ced03e))
- **uikit:** fixed mention suggestion properly based on updated members ([fb50bbd](https://github.com/sendbird/sendbird-uikit-react-native/commit/fb50bbd8eb7f398b64026430484b7caaac0df347))

## [2.4.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.4.1...v2.4.2) (2023-04-28)

### Features

- **uikit:** added queryCreator prop to GroupChannelBannedUsersFragment ([dd682e8](https://github.com/sendbird/sendbird-uikit-react-native/commit/dd682e842a3ec2204db264a69fc2fdc4443a7312))
- **uikit:** added queryCreator prop to GroupChannelMembersFragment ([38eb2fe](https://github.com/sendbird/sendbird-uikit-react-native/commit/38eb2fe9e477613d061c0fa095c10194b8841a3c))
- **uikit:** added queryCreator prop to GroupChannelMutedMembersFragment ([37e6be7](https://github.com/sendbird/sendbird-uikit-react-native/commit/37e6be7de491f25758d9cc485525982b64be2306))
- **uikit:** added queryCreator prop to GroupChannelOperatorsFragment ([63d08e8](https://github.com/sendbird/sendbird-uikit-react-native/commit/63d08e80245ecdd0d2f5237e38eb222cce88ce2b))
- **uikit:** added queryCreator prop to GroupChannelRegisterOperatorFragment ([7e1485a](https://github.com/sendbird/sendbird-uikit-react-native/commit/7e1485aeda758ac62e4c3c746f7f1802fe505b3c))
- **uikit:** added queryCreator prop to OpenChannelBannedUsersFragment ([16e1e4c](https://github.com/sendbird/sendbird-uikit-react-native/commit/16e1e4cb7128a0dd5d2b33768c121ec3ad52b39d))
- **uikit:** added queryCreator prop to OpenChannelMutedParticipantsFragment ([0e7c462](https://github.com/sendbird/sendbird-uikit-react-native/commit/0e7c462b9976a382d27e476fac1f4b32ae0ef2ef))
- **uikit:** added queryCreator prop to OpenChannelOperatorsFragment ([d7746f5](https://github.com/sendbird/sendbird-uikit-react-native/commit/d7746f5869a95e809339bf6df200a4d4256f70b9))
- **uikit:** added queryCreator prop to OpenChannelParticipantsFragment ([01f82da](https://github.com/sendbird/sendbird-uikit-react-native/commit/01f82da1694475aff3cbbb56faa1a11a15e69de3))
- **uikit:** added queryCreator prop to OpenChannelRegisterOperatorFragment ([3693856](https://github.com/sendbird/sendbird-uikit-react-native/commit/369385611d7c6cf90cb1a0c62bba650b1640a724))

## [2.4.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.4.0...v2.4.1) (2023-03-24)

### Bug Fixes

- **uikit:** fixed connection failure due to duplicate network listener invocation on v4.6.0+ session token connection. ([ff761f3](https://github.com/sendbird/sendbird-uikit-react-native/commit/ff761f3414bb6018813561c0014ff95388827097))

### Improvements

- refactored createFileService functions and utils structure ([5e44d4f](https://github.com/sendbird/sendbird-uikit-react-native/commit/5e44d4f7a989df54f103efc67f7d18c28405426c))

## [2.4.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.3.0...v2.4.0) (2023-03-15)

### Features

- added open channel message components ([2cbdcba](https://github.com/sendbird/sendbird-uikit-react-native/commit/2cbdcbab09f737918d9e93fe8ae325abf7424280))
- **uikit:** added open channel banned users fragment. ([391a871](https://github.com/sendbird/sendbird-uikit-react-native/commit/391a8713496d688a4d05dec5e85e9555db05b325))
- **uikit:** added open channel create fragment ([21d4bb5](https://github.com/sendbird/sendbird-uikit-react-native/commit/21d4bb5a45a48e4404509b825eb34a873dd5e8a7))
- **uikit:** added open channel fragment ([6250770](https://github.com/sendbird/sendbird-uikit-react-native/commit/62507708a40a3c92655d29615ff90fb3961877a5))
- **uikit:** added open channel list fragment ([61fff68](https://github.com/sendbird/sendbird-uikit-react-native/commit/61fff68d8d012573006e2009e3ff93fbd94dcb12))
- **uikit:** added open channel moderation fragment ([539b3d2](https://github.com/sendbird/sendbird-uikit-react-native/commit/539b3d207c23a67e2af7b35008977f883a7a74d8))
- **uikit:** added open channel muted participants fragment ([f876ba7](https://github.com/sendbird/sendbird-uikit-react-native/commit/f876ba7777279b7b6080f764d25aaf86b5b49233))
- **uikit:** added open channel operators fragment ([aea29af](https://github.com/sendbird/sendbird-uikit-react-native/commit/aea29af01a4c6275b1d797eef5f8e07bae0d615a))
- **uikit:** added open channel participants fragment ([c4dd37f](https://github.com/sendbird/sendbird-uikit-react-native/commit/c4dd37f67f4c69b4ae70939e7beb374f3eb81af8))
- **uikit:** added open channel register operator fragment ([be883c9](https://github.com/sendbird/sendbird-uikit-react-native/commit/be883c9481198cade983595c3b0c24f0fc8c7583))
- **uikit:** added open channel settings fragment ([48ebf2a](https://github.com/sendbird/sendbird-uikit-react-native/commit/48ebf2ae8888a93de710c313d4151d955ef67735))
- **utils:** added useDebounceEffect hook ([dc90bb4](https://github.com/sendbird/sendbird-uikit-react-native/commit/dc90bb420c42c705bf3b01a4ab6250e89c68ab4f))

### Bug Fixes

- **uikit:** added missing onLoadNext call to user list components ([6592e11](https://github.com/sendbird/sendbird-uikit-react-native/commit/6592e110deaba0a14dc98eee098501c72064077a))

### Improvements

- replaced useUniqId to useUniqHandlerId ([543e149](https://github.com/sendbird/sendbird-uikit-react-native/commit/543e1496f9ac9c92845fd2d98902dc3efe28ec06))
- **uikit:** added `disabled` option to `errorBoundary` in `SendbirdUIKitContainer` props ([6070d54](https://github.com/sendbird/sendbird-uikit-react-native/commit/6070d54990015addf40dceb4ad81f072cef1f778))
- **uikit:** expanded interfaces for channel input to make customization implementation easier ([4d3f183](https://github.com/sendbird/sendbird-uikit-react-native/commit/4d3f1838c89e7be88ca2e12deb237b09afb5996a))
- **uikit:** extract base channel input component from group channel module ([462291e](https://github.com/sendbird/sendbird-uikit-react-native/commit/462291e40b67ba2767e44be34534d20ff52052d1))

## [2.3.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.2.0...v2.3.0) (2023-02-09)

### Features

- added image compression feature ([568b5bb](https://github.com/sendbird/sendbird-uikit-react-native/commit/568b5bb86efa2cd1310be62207b4f2345d159d21))

### Bug Fixes

- added missing labels for permissions ([89186bd](https://github.com/sendbird/sendbird-uikit-react-native/commit/89186bd5a64573a0994495c927cd1442f0af5e80))
- **uikit:** fixed to useContext type compiles the correct package path ([d17ccb0](https://github.com/sendbird/sendbird-uikit-react-native/commit/d17ccb0a1a492b6ec6558e97e7d3b35021db2242))
- **uikit:** support compatibility for removing AppState listener under 0.65 ([b122691](https://github.com/sendbird/sendbird-uikit-react-native/commit/b12269130dd5648c4afe5497957ef47832ca6672))

## [2.2.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.1.0...v2.2.0) (2023-01-03)

### Features

- added group channel notifications fragment ([dfb891d](https://github.com/sendbird/sendbird-uikit-react-native/commit/dfb891d76e79ad33f1b184c248e0d0688add2c13))
- **foundation:** added mention related props to group channel preview ([507a1af](https://github.com/sendbird/sendbird-uikit-react-native/commit/507a1af747ca5190e436028c4755f5ebab685cad))
- **uikit:** added emoji manager ([1cad175](https://github.com/sendbird/sendbird-uikit-react-native/commit/1cad175228c89ea995743279ddcbf6ddc0b099e8))
- **uikit:** added reaction addons ([1a0db30](https://github.com/sendbird/sendbird-uikit-react-native/commit/1a0db308f517d2da280db68f2d81a743174dccfb))
- **uikit:** added reaction bottom sheets ([07ae1ad](https://github.com/sendbird/sendbird-uikit-react-native/commit/07ae1ad0608ed9c28760c135fe631ced17159bb1))
- **uikit:** added reaction user list bottom sheet ([e9ef7e9](https://github.com/sendbird/sendbird-uikit-react-native/commit/e9ef7e9b4715e49a41802453aae95f283917e03b))

### Bug Fixes

- added missing keyExtractor to list components of modules ([4ee1108](https://github.com/sendbird/sendbird-uikit-react-native/commit/4ee110878522e1486882285869b68ad7ec98438f))
- android selection bug ([d2b4c8c](https://github.com/sendbird/sendbird-uikit-react-native/commit/d2b4c8c8b6a7216a4dedf6445daf0f951f34b4c9))

### Improvements

- update time format ([708be93](https://github.com/sendbird/sendbird-uikit-react-native/commit/708be932005f0911e63a5d77ace1cb779357beb9))

## [2.1.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.0.3...v2.1.0) (2022-12-06)

### ⚠ BREAKING CHANGES

- **uikit:** update camera roll module

### Features

- added group channel type selector ([9fb7a19](https://github.com/sendbird/sendbird-uikit-react-native/commit/9fb7a193b5e245ba89030ef9c9d8abae95cf4bba))
- **chat-hooks:** added useGroupChannel hook ([9392dea](https://github.com/sendbird/sendbird-uikit-react-native/commit/9392dea1f5b7c5a102c0aa96107a472f8433bae8))
- support broadcast and supergroup channel ([895fa3b](https://github.com/sendbird/sendbird-uikit-react-native/commit/895fa3b27ffb06977fb326610e8234cfb812ec1f))
- **uikit:** added enableUseUserIdForNickname option ([5d3cfd8](https://github.com/sendbird/sendbird-uikit-react-native/commit/5d3cfd839ba7b0a58f7aba19d46b07b5d8dbea2d))
- **uikit:** added group channel banned users fragment ([80e1a5e](https://github.com/sendbird/sendbird-uikit-react-native/commit/80e1a5ebaf6b80e6bb015ff64a9b4cc6ef2e19d7))
- **uikit:** added group channel moderations fragment ([4213e6d](https://github.com/sendbird/sendbird-uikit-react-native/commit/4213e6dc279739d69dc2617de54ba1446c0e16e3))
- **uikit:** added group channel muted members fragment ([3784b73](https://github.com/sendbird/sendbird-uikit-react-native/commit/3784b7364835fde061f91b157632dc864f555ab1))
- **uikit:** added group channel operators add fragment ([4ac84ee](https://github.com/sendbird/sendbird-uikit-react-native/commit/4ac84ee727b4336555ed84deb70775c308b6d2e5))
- **uikit:** added group channel operators fragment ([c7f6626](https://github.com/sendbird/sendbird-uikit-react-native/commit/c7f6626afd4236542f41aee48cfcdf9b217835b1))
- **uikit:** added mini profile card ([0877463](https://github.com/sendbird/sendbird-uikit-react-native/commit/08774638ba0e283f6da2c63545be746746b64058))
- **uikit:** added moderation in group channel members ([9b25059](https://github.com/sendbird/sendbird-uikit-react-native/commit/9b250594fa3ecf4c02ceeb3ea035ac7060fcf0f5))

### Improvements

- **chat-hooks:** removed activeChannel from useGroupChannelMessages for normalizing ([70fb1c7](https://github.com/sendbird/sendbird-uikit-react-native/commit/70fb1c7ec2acad4f74d95c37c6d0bdf66d3eab88))
- **uikit:** update camera roll module ([5ddb5d3](https://github.com/sendbird/sendbird-uikit-react-native/commit/5ddb5d33f81d8fdd7b4dd2fa541cd687d5a9bd30))

## [2.0.3](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.0.1...v2.0.3) (2022-12-01)

### Improvements

- optimize markAs APIs ([b0fb3aa](https://github.com/sendbird/sendbird-uikit-react-native/commit/b0fb3aa86636b03f0dcc6337eaa17c7336b5bea9))

## [2.0.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.0.0...v2.0.1) (2022-10-26)

### Bug Fixes

- **uikit:** call setBackgroundState only on background status ([ca89ecc](https://github.com/sendbird/sendbird-uikit-react-native/commit/ca89ecc7305977f584159d2cc9b25498f22f7b0b))

## [2.0.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v2.0.0-rc.0...v2.0.0) (2022-10-11)

**Note:** Version bump only for package @sendbird/uikit-react-native

## [2.0.0-rc.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.1.2...v2.0.0-rc.0) (2022-10-11)

### ⚠ BREAKING CHANGES

- migrated to Chat SDK v4

### Features

- migrated to Chat SDK v4 ([5ce9e4f](https://github.com/sendbird/sendbird-uikit-react-native/commit/5ce9e4f99bfac790ce66cc13c7e390e578f08713))

### Documentation

- update core components ([040dbb4](https://github.com/sendbird/sendbird-uikit-react-native/commit/040dbb442427428e1d522a8adaf802eb073942a9))
- update README ([a1b7452](https://github.com/sendbird/sendbird-uikit-react-native/commit/a1b74524741af306b32736b9338d28ead3769bc7))

## [1.1.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.1.1...v1.1.2) (2022-09-28)

### Features

- added an alert to go to app settings when permission is not granted (QM-1799) ([dfb9322](https://github.com/sendbird/sendbird-uikit-react-native/commit/dfb9322dc0b1f26e8c0f69f761966f6a2f326e67))

### Bug Fixes

- ellipsis name in the message (QM-1788, QM-1790) ([cf39461](https://github.com/sendbird/sendbird-uikit-react-native/commit/cf39461810161a23599860964ebdd78e35192e4a))
- fixed createFileService.native to save media files properly on Android (QM-1766) ([939d2b4](https://github.com/sendbird/sendbird-uikit-react-native/commit/939d2b4d637cf46de8f38ea16ed0460ab90f1f8f))
- fixed createFileService.native to save video files properly on iOS13 (QM-1765) ([811039b](https://github.com/sendbird/sendbird-uikit-react-native/commit/811039b57d1a4d1024130ff2d78ce164c92af0fa))
- truncate file viewer header title(QM-1798) ([6c34292](https://github.com/sendbird/sendbird-uikit-react-native/commit/6c3429243075cfd0f05026526a8e3945cc0e0b8f))

## [1.1.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.1.0...v1.1.1) (2022-09-14)

### Features

- **chat-hooks:** added useMessageOutgoingStatus hook ([f3af2a7](https://github.com/sendbird/sendbird-uikit-react-native/commit/f3af2a7e265486a35e209d6353d2b74e7b2c3cba))

### Bug Fixes

- added missing collectionCreator prop to GroupChannelListFragment ([d06d60e](https://github.com/sendbird/sendbird-uikit-react-native/commit/d06d60e76639eb1f68bfef8d63ed1f79e1d3069d))
- **chat-hooks:** respect the order of group channel collection and query. ([913875d](https://github.com/sendbird/sendbird-uikit-react-native/commit/913875db138518fd03648074fe959617ae67b791))

## [1.1.0](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.2...v1.1.0) (2022-08-31)

### Features

- **uikit:** added file viewer component ([9b9d52b](https://github.com/sendbird/sendbird-uikit-react-native/commit/9b9d52b58dd508bce5c577ec5975cd2ef21ccd77))
- **uikit:** added TypingIndicator and MessageReceiptStatus in Channel List ([39c54fc](https://github.com/sendbird/sendbird-uikit-react-native/commit/39c54fcfa617def1f2b1dcb05eaa990dd19abc52))
- **uikit:** added video message component and media service ([15713e5](https://github.com/sendbird/sendbird-uikit-react-native/commit/15713e5ca052c5b3a7f5ad6e79ef40252652675d))

### Bug Fixes

- **uikit:** changed type of createExpoNotificationService param ([e030128](https://github.com/sendbird/sendbird-uikit-react-native/commit/e0301285bbd17902bf36e510f142c109aa68858e))

### Documentation

- **uikit:** update README.md ([5c5bbe5](https://github.com/sendbird/sendbird-uikit-react-native/commit/5c5bbe5c36338e0e863e0ef9bc12df88b10b9592))
- **uikit:** update README.md ([3a4b055](https://github.com/sendbird/sendbird-uikit-react-native/commit/3a4b055d73736da9215b0a7c5d01950a6e71997b))

### Improvements

- **chat-hooks:** remove deps from useChannelHandler ([fe4ec27](https://github.com/sendbird/sendbird-uikit-react-native/commit/fe4ec27b1ab6df84aa08fea2e48fb8fb89b943c9))

## [1.0.2](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0...v1.0.2) (2022-08-09)

### Bug Fixes

- **uikit:** fixed createFileService.expo to work as expected ([876d72c](https://github.com/sendbird/sendbird-uikit-react-native/commit/876d72c2a4f13079e44d55032460a94d04d7c5b3))

### Improvements

- remove React.FC ([303f80b](https://github.com/sendbird/sendbird-uikit-react-native/commit/303f80be04cc4631a6103dad61c4540d9ad7596a))

## [1.0.1](https://github.com/sendbird/sendbird-uikit-react-native/compare/v1.0.0...v1.0.1) (2022-08-09)

### Bug Fixes

- **uikit:** fixed createFileService.expo to work as expected ([876d72c](https://github.com/sendbird/sendbird-uikit-react-native/commit/876d72c2a4f13079e44d55032460a94d04d7c5b3))

### Improvements

- remove React.FC ([303f80b](https://github.com/sendbird/sendbird-uikit-react-native/commit/303f80be04cc4631a6103dad61c4540d9ad7596a))

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

- apply strings review ([a4c94e3](https://github.com/sendbird/sendbird-uikit-react-native/commit/a4c94e380f64919f929c9a494e9fcfb6ba1263cf))
- **chat-hooks:** rename module ([7a2c30c](https://github.com/sendbird/sendbird-uikit-react-native/commit/7a2c30cf136883ef551ae59e9cc848fea81088ff))
- **core:** changed label keys, inject one-source user no name label ([003d46d](https://github.com/sendbird/sendbird-uikit-react-native/commit/003d46d22e3771e6eaec3b2efea79d9715357073))
- **core:** GroupChannelSettings component segmentation ([4bfdfde](https://github.com/sendbird/sendbird-uikit-react-native/commit/4bfdfdea09e75d61b58967586417ad39a2b8aa2a))
- **core:** re-naming GroupChannelInfo to GroupChannelSettings ([afc6e23](https://github.com/sendbird/sendbird-uikit-react-native/commit/afc6e23a90ca8dabc4d684b3b27ab3e5817c7caa))
- **core:** renamed ignoreActiveOnly prop of UserListHeader ([89e80d9](https://github.com/sendbird/sendbird-uikit-react-native/commit/89e80d9672ea20684a4732f2329e26ad4a2f9fb9))
- **core:** renamed onLeaveChannel prop of GroupChannelFragment ([d5aa8f7](https://github.com/sendbird/sendbird-uikit-react-native/commit/d5aa8f7944e35a6bbeecbc02b332a4f51f9fdf2b))
- improve stability ([1698bc1](https://github.com/sendbird/sendbird-uikit-react-native/commit/1698bc19b0c1cc3641c27ef627475ea0355e4e9a))
- improve stability ([72648d1](https://github.com/sendbird/sendbird-uikit-react-native/commit/72648d14e00a01b4c856e7b794a6a22ee7e5b9d7))
- **uikit:** display username as single line ([fad080b](https://github.com/sendbird/sendbird-uikit-react-native/commit/fad080bcdcc40e65f5214082f4f4916bc7661377))
- **uikit:** fragment creator params should be partial ([c53ba95](https://github.com/sendbird/sendbird-uikit-react-native/commit/c53ba95c75396a0fe67dde26f8741d039ac97223))
- **uikit:** prevent crash on open graph ([a5663ca](https://github.com/sendbird/sendbird-uikit-react-native/commit/a5663ca365abf3bb90110d2754fffa299cd3468c))
- **uikit:** remove sdk injection, support better locale type infer ([13dfe9d](https://github.com/sendbird/sendbird-uikit-react-native/commit/13dfe9df6482be97fc9da249d3ea188561cd21f3))
- **uikit:** set keyboardAvoidOffset as a prop ([7679e2f](https://github.com/sendbird/sendbird-uikit-react-native/commit/7679e2fd833d23e9ec8a1ec1f544f8fb2c0e7483))

### Features

- added status component to GroupChannelList ([8ee6ae5](https://github.com/sendbird/sendbird-uikit-react-native/commit/8ee6ae5542c81be173c6329ed6efca5aa1aa8364))
- **uikit:** added error boundary ([952cf9c](https://github.com/sendbird/sendbird-uikit-react-native/commit/952cf9cda612a515d5e7910b6dce81d6c2ee6efb))
- **uikit:** added extension ([52de301](https://github.com/sendbird/sendbird-uikit-react-native/commit/52de301bd8cfa7f660162e0c4951e4db53a3238e))
- **uikit:** added internal local cache storage ([f78a492](https://github.com/sendbird/sendbird-uikit-react-native/commit/f78a492651ea3a2a1e6b4300d6d33c83eac075d0))

## 0.1.2 (2022-04-26)

### Bug Fixes

- fixed channel preview update properly ([b8b3d53](https://github.com/sendbird/sendbird-uikit-react-native/commit/b8b3d536d80b1f15b39e47e428d648da4f513831))
- **foundation:** relocation files ([b0d7426](https://github.com/sendbird/sendbird-uikit-react-native/commit/b0d7426d00153d2dcb136ae9bef5de2bb34ddbe2))

### Features

- added default locale string set ([1c66add](https://github.com/sendbird/sendbird-uikit-react-native/commit/1c66add5f1afc4986b13c4783c738c713136a753))
- added message components ([682cdb4](https://github.com/sendbird/sendbird-uikit-react-native/commit/682cdb433e316f03797b2021c0eba8a313b7cf8e))
- added sample project for real-time development ([e6a9e25](https://github.com/sendbird/sendbird-uikit-react-native/commit/e6a9e25f59368d7f5ea74422fc637e4a354e30e7))
- added storybook ([eddf162](https://github.com/sendbird/sendbird-uikit-react-native/commit/eddf162029268390233d2a2de23fb6f081e3c432))
- added theme typography ([6405333](https://github.com/sendbird/sendbird-uikit-react-native/commit/640533395f0de32cf41bd5330924a3c0a9e38bae))
- added toast ([ddd8de6](https://github.com/sendbird/sendbird-uikit-react-native/commit/ddd8de642cfc911f3c1931edfc6ed94b8dd88b45))
- **chat-hooks:** added enableCollection options to groupChannel hooks ([8fc2454](https://github.com/sendbird/sendbird-uikit-react-native/commit/8fc245485f51feceb2ae7cb0a32ca5cbb9f372d7))
- **core:** added group channel members fragment ([815278d](https://github.com/sendbird/sendbird-uikit-react-native/commit/815278dc4a0a2b679dbcf1992342d9d1756f7453))
- **core:** added message handlers ([2d9f1c4](https://github.com/sendbird/sendbird-uikit-react-native/commit/2d9f1c40d273df9c73b0ad4d8b9d6794af73a576))
- **core:** added typing indicator to group channel ([86d835d](https://github.com/sendbird/sendbird-uikit-react-native/commit/86d835d95034ce20b4471689c603a4f7a7d5a648))
- **core:** implement channel menu to groupChannelList ([debb6d8](https://github.com/sendbird/sendbird-uikit-react-native/commit/debb6d8144c598eb50a124daa5d49641d4bbf1f1))
- **core:** implement send message and file pick flow ([2cc40f8](https://github.com/sendbird/sendbird-uikit-react-native/commit/2cc40f895b59764bd74e8f27513ebb7131721ca1))
- create modularization template script ([ccf022d](https://github.com/sendbird/sendbird-uikit-react-native/commit/ccf022d1da90a88573a1c64c508ad93e22a816d8))
- create type selector ([6139231](https://github.com/sendbird/sendbird-uikit-react-native/commit/6139231e16dc1d78336fb8a1ce0677c43eaf6c30))
- extract foundation package ([41245cc](https://github.com/sendbird/sendbird-uikit-react-native/commit/41245ccff4f76efee2e18e76f34517eb93050798))
- **foundation:** added Badge component ([7b63d90](https://github.com/sendbird/sendbird-uikit-react-native/commit/7b63d90912ce90dbdc7a5cea580f37b4e711d501))
- **foundation:** added Placeholder component ([e68d9a6](https://github.com/sendbird/sendbird-uikit-react-native/commit/e68d9a6f3747930c18b7cb5d8c4c8ec7c7915f47))
- **sample:** added change nickname ([0eceb48](https://github.com/sendbird/sendbird-uikit-react-native/commit/0eceb48b4e365219906a101e7eaa167e498a87ee))
- **sample:** added create channel ([66e7ae9](https://github.com/sendbird/sendbird-uikit-react-native/commit/66e7ae9a035b3b46e58032ba8336bc93fe04131c))
- **sample:** added settings ui ([bb81801](https://github.com/sendbird/sendbird-uikit-react-native/commit/bb818015db8aaafa5ca3b0761b20bf4f1bf1c9fc))
- setup lerna ([#21](https://github.com/sendbird/sendbird-uikit-react-native/issues/21)) ([1382c42](https://github.com/sendbird/sendbird-uikit-react-native/commit/1382c4286c07bcb9a3f8a8c32d757c451610cc76))
- show palette and theme colors to sample app ([1b0cd55](https://github.com/sendbird/sendbird-uikit-react-native/commit/1b0cd5525e8f5716c52fa088a0aa38db36115ced))
- **uikit:** added message receipt ([9cafe11](https://github.com/sendbird/sendbird-uikit-react-native/commit/9cafe11c499196851dea1861eb29bf533737261b))
