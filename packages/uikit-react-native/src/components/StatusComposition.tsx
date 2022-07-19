import React from 'react';

type Props = {
  loading?: boolean;
  LoadingComponent?: JSX.Element;
  error?: boolean;
  ErrorComponent?: JSX.Element;
  children: React.ReactNode;
};
const StatusComposition = ({ children, error, ErrorComponent, LoadingComponent, loading }: Props) => {
  if (loading && LoadingComponent) return <>{LoadingComponent}</>;
  if (error && ErrorComponent) return <>{ErrorComponent}</>;
  return <>{children}</>;
};

export default StatusComposition;
