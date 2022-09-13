import React, { ErrorInfo } from 'react';
import { View } from 'react-native';

import TypedPlaceholder from '../components/TypedPlaceholder';
import type { ErrorBoundaryProps } from '../types';

const DefaultErrorBoundaryComponent = (props: ErrorBoundaryProps) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TypedPlaceholder type={'error-wrong'} onPressRetry={props.reset} />
    </View>
  );
};

class InternalErrorBoundaryContainer extends React.PureComponent<{
  onError?: (props: ErrorBoundaryProps) => void;
  ErrorInfoComponent?: (props: ErrorBoundaryProps) => JSX.Element;
  children?: React.ReactNode;
}> {
  static defaultProps = {
    ErrorInfoComponent: DefaultErrorBoundaryComponent,
  };

  state: { error: Error | null; errorInfo: ErrorInfo | null } = {
    error: null,
    errorInfo: null,
  };

  componentDidCatch = (error: Error, errorInfo: ErrorInfo) => {
    this.setState({ error, errorInfo });
    this.props.onError?.({ error, errorInfo, reset: this.reset });
  };

  reset = () => {
    this.setState({ error: null, errorInfo: null });
  };

  render = () => {
    if (this.state.error && this.state.errorInfo) {
      return (
        this.props.ErrorInfoComponent?.({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          reset: this.reset,
        }) ?? null
      );
    }

    return <>{this.props.children}</>;
  };
}

export default InternalErrorBoundaryContainer;
