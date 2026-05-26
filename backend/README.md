Minimal Node backend for TheMatchers project.

Endpoints:
- GET /health -> returns JSON { status: 'ok', timestamp }
- POST /api/notifications/device-token -> stores the current user's FCM token

Run locally:

```bash
node backend/server.js
```

Or from the repo root after adding the script:

```bash
npm run start:backend
```

Push notifications:
- Add Firebase service account credentials through `FIREBASE_SERVICE_ACCOUNT_JSON` or `GOOGLE_APPLICATION_CREDENTIALS`.
- Add the app Firebase config files locally:
  - Android: `android/app/google-services.json`
  - iOS: `ios/GoogleService-Info.plist`, then run `pod install` in `ios/`
- The server sends pushes when a profile is created and when a match status changes to `engaged` or `married`.
