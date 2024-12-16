import 'dotenv/config';

export default {
  expo: {
    name: "RVCE Visitor Management",
    slug: "rvce-visitor-management",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.rvce.visitormanagement",
      permissions: [
        "INTERNET"
      ]
    },
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY ?? null,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN ?? null,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? null,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? null,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? null,
      firebaseAppId: process.env.FIREBASE_APP_ID ?? null,
      eas: {
        projectId: "85237c32-aa20-41cb-b29e-9fdc64ee6c4c"
      }
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 33,
            targetSdkVersion: 33,
            buildToolsVersion: "33.0.0"
          }
        }
      ]
    ]
  }
}; 