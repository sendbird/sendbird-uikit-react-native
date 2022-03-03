import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Icon from '../Icon';
import Text from '../Text';

type Props = {
  style?: StyleProp<ViewStyle>;
};
const DialogSheet: React.FC<Props> & { Item: typeof SheetItem } = ({ style, children }) => {
  const { colors } = useUIKitTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.ui.dialog.default.none.background }, style]}>
      {children}
    </View>
  );
};

export type SheetItemProps = {
  icon?: keyof typeof Icon.Assets;
  iconColor?: string;
  title: string;
  titleColor?: string;
};
const SheetItem: React.FC<SheetItemProps> = ({ icon, title, iconColor, titleColor }) => {
  const { colors } = useUIKitTheme();
  return (
    <View style={[styles.sheetItemContainer, { backgroundColor: colors.ui.dialog.default.none.background }]}>
      {icon && (
        <Icon
          icon={icon}
          color={iconColor ?? colors.ui.dialog.default.none.highlight}
          containerStyle={styles.sheetItemIcon}
        />
      )}
      <Text
        subtitle1
        numberOfLines={1}
        color={titleColor ?? colors.ui.dialog.default.none.text}
        style={styles.sheetItemText}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    overflow: 'hidden',
    flexDirection: 'column',
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  sheetItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  sheetItemIcon: {
    marginLeft: 16,
  },
  sheetItemText: {
    marginHorizontal: 24,
  },
});

DialogSheet.Item = SheetItem;
export default DialogSheet;
