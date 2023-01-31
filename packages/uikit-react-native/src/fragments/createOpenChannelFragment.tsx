import React from 'react';

import type { OpenChannelFragment, OpenChannelModule } from '../domain/openChannel/types';
import { createOpenChannelModule } from '../domain/openChannel';
import { NOOP } from '@sendbird/uikit-utils';

const createOpenChannelFragment = (initModule?: Partial<OpenChannelModule>): OpenChannelFragment => {
  const OpenChannelModule = createOpenChannelModule(initModule);

  return ({ onPressHeaderLeft = NOOP, children }) => {
    // const { domainViewProps, loading } = useOpenChannel();

    // if (loading) return <OpenChannelModule.StatusLoading />;

    return (
      <OpenChannelModule.Provider>
        <OpenChannelModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <OpenChannelModule.View domainViewProp={'some-prop'} />
        {children}
      </OpenChannelModule.Provider>
    );
  };
};

export default createOpenChannelFragment;
