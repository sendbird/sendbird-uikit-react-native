import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import Icon from '../../components/Icon';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';

type Props = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;
const DialogSheet: ((props: Props) => ReactNode) & { Item: typeof SheetItem } = ({ style, children }) => {
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
  disabled?: boolean;
};
const SheetItem = ({ icon, title, iconColor, titleColor, disabled = false }: SheetItemProps) => {
  const { colors } = useUIKitTheme();
  return (
    <View style={[styles.sheetItemContainer, { backgroundColor: colors.ui.dialog.default.none.background }]}>
      {icon && (
        <Icon
          icon={icon}
          color={
            iconColor ?? (disabled ? colors.ui.dialog.default.none.blurred : colors.ui.dialog.default.none.highlight)
          }
          containerStyle={styles.sheetItemIcon}
        />
      )}
      <Text
        subtitle1
        numberOfLines={1}
        color={titleColor ?? (disabled ? colors.ui.dialog.default.none.blurred : colors.ui.dialog.default.none.text)}
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
    flex: 1,
    marginHorizontal: 24,
  },
});

DialogSheet.Item = SheetItem;
export default DialogSheet;
