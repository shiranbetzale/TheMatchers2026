# Detox E2E testing

The project includes Detox tests for Android and iOS. They cover application launch, reload/background recovery, matchmaker login, candidate SMS verification, candidate voice verification, validation failures, and session restoration.

## Safety

The E2E credentials below work only in React Native debug builds because the implementation is guarded by `__DEV__`. They do not call Firebase, Twilio, or the backend and are not available in release/App Store/Google Play builds.

- Matchmaker phone: `0500000001`
- Matchmaker password: `e2e-matchmaker`
- Candidate phone: `0500000002`
- Matchmaker phone for candidate flow: `0500000001`
- Candidate verification code: `123456`

## Stable test IDs

`CustomInput` automatically exposes an ID based on its placeholder:

```text
input-phoneNumber
input-password
input-matchmakerCode
input-candidateCodePlaceholder
```

`CustomButton` automatically exposes an ID based on its `text` prop or a direct `CustomText` child:

```text
button-login
button-confirm
button-candidateVoiceCall
button-matchmakerTab
button-shidduchTab
button-skip
button-allCards
```

An explicit `testID` can still be supplied and takes priority over the generated value.

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

## Covered flows

- Fresh install and onboarding skip.
- Login controls and stable test IDs.
- Missing-field validation.
- Invalid-phone validation.
- Matchmaker login success.
- Matchmaker session restoration after relaunch.
- Candidate mode switching.
- Candidate SMS verification success without sending SMS.
- Candidate incorrect-code rejection.
- Candidate voice verification success without placing a call.
- Cold launch, React Native reload, and background restoration.

## What still requires real-device testing

Detox debug fixtures prove that the UI, navigation, local session storage, and verification state machine work. Before store submission, separately test Firebase SMS, Play Integrity/reCAPTCHA, APNs silent verification, Twilio voice calls, push notifications, and production backend connectivity on real devices.
