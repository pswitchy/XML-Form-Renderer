const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    assetExts: [
      ...config.resolver.assetExts,
      'png',
      'jpg',
      'jpeg',
      'gif',
      'svg'
    ],
    sourceExts: [
      ...config.resolver.sourceExts,
      'svg'
    ],
  },
};