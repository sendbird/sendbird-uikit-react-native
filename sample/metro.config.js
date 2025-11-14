/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const sampleRoot = __dirname;
const workspaceRoot = path.resolve(sampleRoot, '..');

const customConfig = {
  projectRoot: sampleRoot,
  watchFolders: [workspaceRoot],
};

module.exports = mergeConfig(getDefaultConfig(sampleRoot), customConfig);
