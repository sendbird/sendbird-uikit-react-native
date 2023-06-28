import type { FastImageProps } from 'react-native-fast-image';

let FastImageInternal: (props: FastImageProps) => JSX.Element | null = () => null;

try {
  FastImageInternal = require('react-native-fast-image') as (props: FastImageProps) => JSX.Element;
} catch {}

export default FastImageInternal;
