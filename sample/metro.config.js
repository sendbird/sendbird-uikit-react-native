/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');
const path = require('path');
const sampleRoot = __dirname;
const workspaceRoot = path.resolve(sampleRoot, '..');

const customConfig = {
  projectRoot: sampleRoot,
  watchFolders: [workspaceRoot],
};

const mergedConfig = mergeConfig(getDefaultConfig(sampleRoot), customConfig);

module.exports = withStorybook(mergedConfig, {
  enabled: true,
  configPath: path.resolve(__dirname, './.rnstorybook'),
});
