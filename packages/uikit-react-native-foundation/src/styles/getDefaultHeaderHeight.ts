const DEFAULT_LANDSCAPE_HEIGHT = 48;
const DEFAULT_HEIGHT = 56;

const getDefaultHeaderHeight = (isLandscape: boolean) => {
  if (isLandscape) return DEFAULT_LANDSCAPE_HEIGHT;
  return DEFAULT_HEIGHT;
};

export default getDefaultHeaderHeight;
