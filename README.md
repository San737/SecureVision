# SecureVision — Capture, Seal, Verify

SecureVision is a React Native app (Expo Router) that captures photos, attaches provenance-like metadata, and simulates sealing and verification inspired by C2PA.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Install native modules required by the app (already added to package.json when you ran install above). If you see missing module errors, run:

   ```bash
   npx expo install expo-camera expo-location expo-device expo-image-picker @react-native-async-storage/async-storage react-native-get-random-values uuid
   ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Features

- Camera capture with preview (expo-camera)
- Collects timestamp, GPS (with permission), and device id
- Simulated C2PA sealing: writes a manifest sidecar and copies image to app storage
- Verify screen: pick an image and validate if a sidecar manifest exists
- Sealed list and details screens

Note: Real C2PA embedding requires native/Rust SDKs. This project uses a local demo flow — wire `utils/c2pa.ts` to your backend for production.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
