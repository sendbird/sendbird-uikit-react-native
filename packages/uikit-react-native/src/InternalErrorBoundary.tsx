import React, { ErrorInfo } from 'react';

import type { ErrorBoundaryProps } from './types';

class InternalErrorBoundary extends React.PureComponent<{
  onError?: (props: ErrorBoundaryProps) => void;
  ErrorInfoComponent?: (props: ErrorBoundaryProps) => JSX.Element;
}> {
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

export default InternalErrorBoundary;
