import { useContext } from 'react';

import { HeaderStyleContext } from './HeaderStyleContext';

const useHeaderStyle = () => {
  return useContext(HeaderStyleContext);
};

export default useHeaderStyle;
