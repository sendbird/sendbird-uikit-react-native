import type { ReactNode } from 'react';
import type { FastImageProps } from 'react-native-fast-image';

let FastImageInternal: (props: FastImageProps) => ReactNode | null = () => null;

try {
  FastImageInternal = require('react-native-fast-image') as (props: FastImageProps) => ReactNode;
} catch {}

export default FastImageInternal;
