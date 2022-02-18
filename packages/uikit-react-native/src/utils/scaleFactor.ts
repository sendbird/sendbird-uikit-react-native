import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

const DESIGNED_DEVICE_WIDTH = 360;

const createScaleFactor = (deviceWidth = DESIGNED_DEVICE_WIDTH) => {
  const ratio = Math.min(width, height) / deviceWidth;
  return (dp: number) => PixelRatio.roundToNearestPixel(dp * ratio);
};

export const defaultScaleFactor = createScaleFactor();

export default createScaleFactor;
