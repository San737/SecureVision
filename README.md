# SecureVision — Local Development Guide

SecureVision is a React Native mobile app built with Expo that captures photos, attaches provenance metadata, and simulates C2PA-like sealing and verification.

---

## Prerequisites

- **Node.js** 16+ (recommend 18 or 20)
- **npm** or **yarn**
- **Expo CLI** (installed globally or via npx)
- **Android Studio** (for Android emulator) or **Xcode** (macOS only, for iOS simulator)
- **Physical device** with Expo Go app (optional, for quick testing)

---

## Setup

### 1. Clone or navigate to the project

```cmd
cd "c:\Users\santh\Desktop\major project\SecureVision"
```

### 2. Install dependencies

```cmd
npm install
```

This will install all required packages from `package.json`, including:

- Expo SDK modules (camera, location, device, image-picker, file-system, media-library)
- AsyncStorage for local persistence
- UUID and utilities

### 3. Verify installation

```cmd
npx expo --version
```

If you see any missing peer dependencies or warnings, you can fix them with:

```cmd
npx expo install --fix
```

---

## Running the app

### Start the development server

```cmd
npx expo start
```

This opens the Expo DevTools in your terminal. You'll see a QR code and options:

- Press **`a`** to open in Android emulator
- Press **`i`** to open in iOS simulator (macOS only)
- Press **`w`** to open in web browser (limited support for camera/location)
- Scan the QR code with **Expo Go** app on your phone

### Run on Android emulator

Ensure Android Studio is installed and an emulator is running, then:

```cmd
npx expo start --android
```

Or press `a` after running `npx expo start`.

### Run on iOS simulator (macOS only)

Ensure Xcode and iOS simulator are installed, then:

```cmd
npx expo start --ios
```

Or press `i` after running `npx expo start`.

### Run on physical device (Expo Go)

1. Install **Expo Go** from App Store (iOS) or Google Play (Android).
2. Run `npx expo start` on your computer.
3. Scan the QR code with:
   - iOS: Camera app → tap the Expo notification
   - Android: Expo Go app → scan QR

**Note**: Ensure your computer and phone are on the same Wi-Fi network.

---

## Project structure

```
SecureVision/
├── app/
│   ├── _layout.tsx           # Root stack (tabs + screens)
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tabs: Camera, Sealed, Verify, About
│   │   ├── index.tsx         # Hidden redirect route
│   │   ├── camera.tsx        # Capture screen
│   │   ├── sealed.tsx        # List sealed items
│   │   ├── verify.tsx        # Pick & verify images
│   │   └── about.tsx         # App info
│   ├── confirm.tsx           # Preview & seal workflow
│   └── details.tsx           # Sealed item detail & verification
├── utils/
│   ├── c2pa.ts               # Public API (re-exports native-aware)
│   ├── c2pa.native-aware.ts  # Native bridge + fallback
│   ├── c2pa.fallback.ts      # JS-only sealing/verification
│   └── storage.ts            # AsyncStorage helpers
├── assets/                   # Images, fonts
├── plugins/
│   └── with-securevision-c2pa.js  # Config plugin (placeholder)
├── native/
│   └── index.d.ts            # TypeScript declarations for native modules
├── app.json                  # Expo config (permissions, plugins)
├── package.json
└── README.md
```

---

## Features & workflow

1. **Camera tab**

   - Capture a photo with optional GPS and device metadata.
   - Photo is immediately persisted to app storage.

2. **Confirm screen**

   - Preview captured photo with metadata.
   - Tap "Seal Image" to generate a manifest and save.

3. **Sealed tab**

   - Lists all sealed images with status badge (valid/tampered/none).
   - Tap an item to view details.
   - Tap "Delete" to remove.

4. **Details screen**

   - Shows manifest and verification result for a sealed item.

5. **Verify tab**
   - Pick any image from your gallery.
   - App verifies it against sealed manifests and shows status, matched method (URI/filename/hash), issuer, file hash, and manifest details.

---

## Permissions

The app requests:

- **Camera** (capture photos)
- **Location** (attach GPS coords to manifest)
- **Photo Library** (save sealed images, pick for verification)

Configured in `app.json` under `ios.infoPlist` and `android.permissions`.

---

## Development tips

### Clear cache

If you see stale code or weird errors:

```cmd
npx expo start --clear
```

### Reset Metro bundler

```cmd
npx expo start --reset-cache
```

### Check for errors

```cmd
npm run lint
npx tsc --noEmit
```

### Debugging

- Shake device or press `Ctrl+M` (Android) / `Cmd+D` (iOS) to open the dev menu.
- Enable **Remote JS Debugging** or use **React DevTools**.

### Hot reload

- Enabled by default; save a file and the app refreshes.
- If it doesn't, press `r` in the terminal to reload manually.

---

## Native C2PA integration (optional)

This app includes a **native-aware C2PA bridge** that falls back to JS if no native module is present.

### To add real C2PA (Rust SDK):

1. Implement a native module in iOS (Swift) and Android (Kotlin/Java) that exposes:

   - `sealImage(photo: {uri}, manifest) => {id, uri, manifest, verification, hash}`
   - `verifyImage(image: {uri}) => {status, issuer, errors, matchedBy, linkedUri, sidecar, fileHash, manifest}`

2. Export it as `C2PA`, `SecureVisionC2PA`, or `C2PAModule` so the bridge auto-detects it.

3. Build a custom dev client:

   ```cmd
   npx expo prebuild
   npx expo run:android
   npx expo run:ios
   ```

4. The app will automatically use the native implementation when available; otherwise it falls back to the JS path.

See `utils/c2pa.native-aware.ts` and `plugins/with-securevision-c2pa.js` for integration hooks.

---

## Troubleshooting

### "Uncaught Error: Attempted to navigate before mounting"

- Fixed by removing early redirects in `(tabs)/index.tsx` and relying on `initialRouteName="camera"`.

### "Camera preview is black after switching tabs"

- Fixed by rendering `CameraView` only when the tab is focused (via `useIsFocused()`).

### "Verify returns 'none' for sealed images"

- Verify now matches by URI, filename, and content hash. If you sealed an image and saved it to the gallery, pick it again and it should verify.

### "Module not found: expo-camera" (or similar)

```cmd
npx expo install expo-camera
```

### Build errors on Android/iOS

- Ensure Android Studio / Xcode are up to date.
- Run `npx expo doctor` to check for common issues.
- Try `npx expo prebuild --clean` to regenerate native folders.

---

## Scripts

```cmd
npm start          # Alias for npx expo start
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run in browser (limited features)
npm run lint       # Run ESLint
```

---

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [C2PA specification](https://c2pa.org/)
- [React Native](https://reactnative.dev/)

---

## License

MIT (or your chosen license)
