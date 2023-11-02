import React, { ReactNode } from 'react';

type Props = {
  loading?: boolean;
  LoadingComponent?: ReactNode;
  error?: boolean;
  ErrorComponent?: ReactNode;
  children: React.ReactNode;
};
const StatusComposition = ({ children, error, ErrorComponent, LoadingComponent, loading }: Props) => {
  if (loading && LoadingComponent) return <>{LoadingComponent}</>;
  if (error && ErrorComponent) return <>{ErrorComponent}</>;
  return <>{children}</>;
};

export default StatusComposition;
