import type { ConfigContext, ExpoConfig } from "expo/config";
import { version } from "./package.json";

const APP_ENV = "development";
// const APP_ENV = "production";

const APP_NAME = "sbkl";
const PROJECT_SLUG = "sbkl";
const OWNER = "sbkl";
const SCHEME = "sbkl";

const BUNDLE_IDENTIFIER = "ltd.sbkl.sbkl";
const PACKAGE_NAME = "ltd.sbkl.sbkl";
const EAS_PROJECT_ID = "";

export default ({ config }: ConfigContext): ExpoConfig => {
  const { name, bundleIdentifier, packageName, scheme } =
    getDynamicAppConfig(APP_ENV);

  return {
    ...config,
    name,
    slug: PROJECT_SLUG,
    owner: OWNER,
    scheme,
    orientation: "portrait",
    version,
    userInterfaceStyle: "automatic",
    updates: {
      fallbackToCacheTimeout: 0,
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
    icon: "./assets/images/icon.png",
    assetBundlePatterns: ["**/*"],
    ios: {
      icon: "./assets/expo.icon",
      supportsTablet: true,
      bundleIdentifier,
      entitlements: {
        "aps-environment": APP_ENV,
      },
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: packageName,
    },
    web: {
      output: "server",
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      router: {},
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
    plugins: [
      "expo-router",
      [
        "expo-dev-client",
        {
          launchMode: "most-recent",
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
          android: {
            image: "./assets/images/splash-icon.png",
            imageWidth: 76,
          },
        },
      ],
      "expo-build-properties",
      "expo-secure-store",
      "expo-web-browser",
      "expo-localization",
    ],
    runtimeVersion: `${version}-${APP_ENV}`,
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
      tsconfigPaths: true,
    },
  };
};

export const getDynamicAppConfig = (
  environment: "development" | "preview" | "production"
) => {
  if (environment === "production") {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      scheme: SCHEME,
    };
  }

  if (environment === "preview") {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      scheme: `${SCHEME}-prev`,
    };
  }

  return {
    name: `${APP_NAME} Development`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}.dev`,
    scheme: `${SCHEME}-dev`,
  };
};
