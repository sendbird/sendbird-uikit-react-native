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
      <View style={styles.head} />

      <View style={styles.contentContainer}>

        {children}
      </View>
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
    <View style={[styles.sheetItemContainer]}>
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
    // overflow: 'hidden',
    flexDirection: 'column',
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,

    backgroundColor: '#F2F4F7',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contentContainer: {
    borderRadius: 16,
    overflow: 'hidden'
  },
  head: {
    alignSelf: 'center',
    width: 36,
    height: 6,
    borderRadius: 6,
    backgroundColor: '#00000033',
    marginBottom: 16,
    marginTop: 6,
  },

  sheetItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,

    overflow: 'hidden',
    backgroundColor: '#F2F4F7',
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
