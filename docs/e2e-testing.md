# Detox E2E testing

The project includes Detox smoke tests for Android and iOS. They verify that a clean installation launches, survives a React Native reload, and returns from the background without crashing.

## Install

```bash
npm install
```

For iOS, also install pods:

```bash
cd ios
pod install
cd ..
```

## Android

Create an Android Virtual Device named `Pixel_7_API_35`, or provide another name:

```bash
export DETOX_AVD_NAME="Your_AVD_Name"
```

Start Metro in one terminal:

```bash
npm start
```

Build and run in another terminal:

```bash
npm run e2e:build:android
npm run e2e:test:android
```

## iOS

The default simulator is `iPhone 16`. Change it in `.detoxrc.js` when that simulator is not installed.

Start Metro in one terminal:

```bash
npm start
```

Build and run in another terminal:

```bash
npm run e2e:build:ios
npm run e2e:test:ios
```

## Expanding coverage

Stable interaction tests should use `testID` instead of visible Hebrew/English labels. Add IDs to the login role selector, phone and password fields, SMS/call buttons, verification-code field, and destination screens before automating real authentication.

Real Firebase SMS and Twilio calls should not run on every CI build. Use dedicated test accounts or a test backend, and keep the basic launch tests deterministic.
