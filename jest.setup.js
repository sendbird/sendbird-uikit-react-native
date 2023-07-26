// import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
// jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

// https://github.com/callstack/react-native-testing-library/issues/1054\
// https://github.com/facebook/react/issues/20756#issuecomment-780927519
// eslint-disable-next-line no-undef
delete global.MessageChannel;
// eslint-disable-next-line no-undef
global.fetch = require('node-fetch');
