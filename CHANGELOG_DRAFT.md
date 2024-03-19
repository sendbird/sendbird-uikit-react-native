## v3.4.3

- Added `disableFastImage` prop to Image component in foundation package.
  ```tsx
  import { Image } from '@sendbird/uikit-react-native-foundation';
  
  // If you don't want to use FastImage in UIKit for React Native, you can specify this default prop
  if (Image.defaultProps) Image.defaultProps.disableFastImage = true;
  ```
