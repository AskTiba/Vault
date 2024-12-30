// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Modify the asset extensions
config.resolver.assetExts.push('db');

// Apply NativeWind configuration
const finalConfig = withNativeWind(config, { input: './global.css' });

module.exports = finalConfig;
