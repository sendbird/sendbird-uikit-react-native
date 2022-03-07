import React from 'react';
import { View } from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Button from '../Button';
import Icon from '../Icon';
import LoadingSpinner from '../LoadingSpinner';
import Text from '../Text';

type Props = {
  loading?: boolean;

  icon: keyof typeof Icon.Assets;
  message?: string;
  errorRetryLabel?: string;
  onPressRetry?: () => void;
};

const Placeholder: React.FC<Props> = ({ icon, loading = false, message = '', errorRetryLabel, onPressRetry }) => {
  const { colors } = useUIKitTheme();

  return (
    <View style={loading ? styles.containerLoading : errorRetryLabel ? styles.containerError : styles.container}>
      {loading ? (
        <LoadingSpinner size={64} color={colors.ui.placeholder.default.none.highlight} />
      ) : (
        <Icon icon={icon} size={64} color={colors.ui.placeholder.default.none.content} />
      )}
      {Boolean(message) && !loading && (
        <Text body3 color={colors.ui.placeholder.default.none.content}>
          {message}
        </Text>
      )}
      {Boolean(errorRetryLabel) && !loading && (
        <Button
          variant={'text'}
          onPress={onPressRetry}
          contentColor={colors.ui.placeholder.default.none.highlight}
          icon={'refresh'}
        >
          {errorRetryLabel}
        </Button>
      )}
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    width: 200,
    height: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerError: {
    width: 200,
    height: 148,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerLoading: {
    width: 200,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Placeholder;
