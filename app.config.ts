import { ExpoConfig } from '@expo/config';

// Define environment variables
const APP_VARIANT = process.env.APP_VARIANT || 'production'; // Fallback to 'production' if undefined
const IS_DEV = APP_VARIANT === 'development';
const IS_PREVIEW = APP_VARIANT === 'preview';
const IS_PRODUCTION = process.env.NODE_ENV === 'production'; // Ensure NODE_ENV is set properly

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.asktiba.Vault.dev';
  }
  if (IS_PREVIEW) {
    return 'com.asktiba.Vault.preview';
  }
  return 'com.asktiba.Vault.production';
};
const getAppName = () => {
  if (IS_DEV) {
    return 'Vault (Dev)';
  }
  if (IS_PREVIEW) {
    return 'Vault';
  }
  return 'Vault 1.0.0';
};

const config: ExpoConfig = {
  name: getAppName(),
  slug: 'Vault',
  version: '1.0.0',
  scheme: 'Vault',
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-dev-launcher',
      {
        launchMode: 'most-recent',
      },
    ],
    'expo-sqlite',
    'expo-asset',
    [
      'expo-font',
      {
        fonts: [
          './assets/fonts/RubikMaze-Regular.ttf',
          './assets//fonts//RubikLines-Regular.ttf',
          './assets//fonts//RubikMaps-Regular.ttf',
        ],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: getUniqueIdentifier(),
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: 'd9ce528f-ee09-432e-a216-aebb80dbf72c',
    },
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: 'https://u.expo.dev/d9ce528f-ee09-432e-a216-aebb80dbf72c',
  },
};

export default config;
