# Store readiness checklist

This document tracks the remaining work before submitting TheMatchers to Google Play and the Apple App Store.

## Build readiness

- [x] Android debug build passes locally.
- [x] Android New Architecture is disabled for stable native builds.
- [x] iOS New Architecture flag is aligned with Android.
- [ ] Android release bundle builds successfully with a real upload keystore.
- [ ] iOS archive builds successfully with App Store distribution signing.
- [ ] TestFlight build is installed and smoke-tested on a real iPhone.
- [ ] Google Play internal testing build is installed and smoke-tested on a real Android device.

## Android release signing

Do not use the debug keystore for Google Play release builds.

Required local or CI properties:

```properties
THEMATCHERS_UPLOAD_STORE_FILE=/absolute/path/to/upload-keystore.jks
THEMATCHERS_UPLOAD_STORE_PASSWORD=...
THEMATCHERS_UPLOAD_KEY_ALIAS=...
THEMATCHERS_UPLOAD_KEY_PASSWORD=...
```

Build command:

```bash
cd android
./gradlew bundleRelease
```

## iOS/App Store privacy

- [ ] App Store Connect privacy answers match the real data collected by the app and Firebase SDKs.
- [ ] Public Privacy Policy URL is available.
- [ ] Account deletion/support flow is documented and reachable.
- [ ] Push notification usage is explained in review notes.
- [ ] Camera and photo library usage strings are clear and accurate.
- [ ] Location permission is not declared unless the app really requests device location.

Expected data disclosures based on current implementation:

- Contact info: name, phone number, email address.
- User content: profile details, preferences, uploaded photos/images.
- Identifiers: internal user/profile IDs, Firebase installation/device identifiers.
- Usage data: screen views and app events through Firebase Analytics.
- Diagnostics: crash logs and diagnostics through Firebase Crashlytics.
- Notifications: FCM/APNs token for push notifications.

## Google Play Data safety

- [ ] Data Safety form matches the app and Firebase SDK behavior.
- [ ] Privacy Policy URL is entered in Play Console.
- [ ] App access instructions include admin/matchmaker test credentials for review.
- [ ] Closed/internal testing completed before production rollout.

Expected Play Data Safety categories:

- Personal info: name, email, phone number.
- Photos and videos: user profile images.
- App activity: app interactions and screen analytics.
- App info and performance: crash logs and diagnostics.
- Device or other IDs: Firebase/device identifiers used for notifications, analytics, and diagnostics.

## Reviewer notes

Provide reviewer credentials and explain the roles:

- Admin: can manage users, cards, logs, statistics, contact requests.
- Matchmaker: can manage assigned cards and matches.
- Candidate/user: can complete a profile flow after phone verification.

Include backend/API status notes and clarify that the app is a private matchmaking management platform.

## Final smoke test before submission

- [ ] Fresh install.
- [ ] Login as admin.
- [ ] Login as matchmaker.
- [ ] Candidate phone flow.
- [ ] Create card.
- [ ] Edit card.
- [ ] Upload/select image.
- [ ] View all cards.
- [ ] View my cards.
- [ ] Create/inspect matches.
- [ ] Set meeting.
- [ ] Archive as engaged/married.
- [ ] Restore from archive.
- [ ] Contact request.
- [ ] Logs screen.
- [ ] Statistics screen.
- [ ] Push notification flow.
- [ ] App restart/session restore.
- [ ] Offline/backend error handling.
