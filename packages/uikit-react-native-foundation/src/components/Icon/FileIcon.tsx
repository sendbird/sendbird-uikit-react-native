import React from 'react';
import { ImageStyle, StyleProp, ViewStyle } from 'react-native';

import Icon from '.';
import { FileType, convertFileTypeToMessageType, getFileIconFromMessageType } from '@sendbird/uikit-utils';

type Props = {
  fileType: FileType;
  color?: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

const FileIcon: (props: Props) => JSX.Element = ({ fileType, color, size = 24, containerStyle, style }: Props) => {
  return (
    <Icon
      icon={getFileIconFromMessageType(convertFileTypeToMessageType(fileType))}
      size={size}
      color={color}
      style={style}
      containerStyle={containerStyle} />
  );
};

export default FileIcon;
