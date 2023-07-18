import React from 'react';
import { ImageStyle, StyleProp, ViewStyle } from 'react-native';

import Icon from '../Icon';

const fileIconMapper = {
  audio: 'file-audio',
  image: 'photo',
  video: 'play',
  file: 'file-document'
} as const;

export type FileIconType = keyof typeof fileIconMapper;

type Props = {
  fileType: FileIconType;
  color?: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

const FileIcon: ((props: Props) => JSX.Element) = ({
  fileType,
  color,
  size = 24,
  containerStyle,
  style,
}: Props) => {
  return <Icon
    icon={fileIconMapper[fileType]}
    size={size}
    color={color}
    style={style}
    containerStyle={containerStyle}
  />
};

export default FileIcon;