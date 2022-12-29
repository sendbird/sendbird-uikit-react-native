import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

const MAX = 4;

type Props = React.PropsWithChildren<{
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
}>;
const AvatarGroup = ({ children, containerStyle, size = 56 }: Props) => {
  const childAmount = React.Children.count(children);

  if (childAmount === 0) {
    return (
      <View
        style={[
          containerStyle,
          {
            overflow: 'hidden',
            width: size,
            height: size,
            borderRadius: size,
            backgroundColor: 'rgba(120,120,120,0.2)',
          },
        ]}
      />
    );
  }

  const renderAvatars = () => {
    return (
      React.Children.map(children, (child, index) => {
        if (index + 1 > MAX) return child;
        if (!React.isValidElement(child)) return child;

        if (childAmount === 1) return React.cloneElement(child as ReactElement, { size, containerStyle });

        const top = getTopPoint(index, childAmount) * size;
        const left = getLeftPoint(index) * size;
        const width = getWidthPoint(index, childAmount) * size;
        const height = getHeightPoint(index, childAmount) * size;
        const innerLeft = -getInnerLeft(index, childAmount) * size;
        const innerTop = -getInnerTop(childAmount) * size;

        return (
          <View style={{ overflow: 'hidden', position: 'absolute', top, left, width, height }}>
            {React.cloneElement(child as ReactElement, {
              size,
              square: true,
              containerStyle: { left: innerLeft, top: innerTop },
            })}
          </View>
        );
      })?.slice(0, 4) ?? []
    );
  };

  return (
    <View style={[containerStyle, { overflow: 'hidden', width: size, height: size, borderRadius: size }]}>
      {renderAvatars()}
    </View>
  );
};

const getHeightPoint = (_: number, total: number) => {
  if (total === 2) return 1;
  return 0.5;
};
const getWidthPoint = (idx: number, total: number) => {
  if (total === 3 && idx === 0) return 1;
  return 0.5;
};
const getTopPoint = (idx: number, total: number) => {
  if (total === 2) return -0.025;
  if (total === 3 && idx === 0) return -0.025;
  if (total === 3 && idx !== 0) return 0.525;
  if (idx === 0 || idx === 1) return -0.025;
  return 0.525;
};
const getLeftPoint = (idx: number) => {
  if (idx === 0 || idx === 2) return -0.025;
  return 0.525;
};
const getInnerLeft = (idx: number, total: number) => {
  if (total === 3 && idx === 0) return 0;
  return 0.25;
};
const getInnerTop = (total: number) => {
  if (total === 2) return 0;
  return 0.25;
};

export default AvatarGroup;
