import React, { useEffect, useState } from 'react';

const StorybookScreen = () => {
  const [screen, setScreen] = useState<JSX.Element | null>(null);
  useEffect(() => {
    const StorybookUI = require('../../stories').default;
    setScreen(<StorybookUI />);
  }, []);
  return <>{screen}</>;
};

export default StorybookScreen;
