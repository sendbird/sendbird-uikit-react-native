## [3.12.9]

### Bug Fixes

- avoid a crash when leaving a channel or list screen in apps that replace the global Promise, such as APM agents
- resume a partially played voice message instead of restarting it, when using expo-audio
- show the correct remaining time while playing a voice message, when using expo-audio
- upgrade vulnerable build dependencies (js-yaml, nx)
