import React, { useEffect, useState } from 'react';

const StorybookScreen = () => {
  const [screen, setScreen] = useState<React.ReactNode | null>(null);
  useEffect(() => {
    const StorybookUI = require('../../.rnstorybook').default;
    setScreen(<StorybookUI />);
  }, []);
  return <>{screen}</>;
};

export default StorybookScreen;
