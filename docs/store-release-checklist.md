# Store release checklist

This checklist is for preparing TheMatchers for App Store and Google Play review.

## Must pass before submission

- Android production build passes on a clean checkout.
- iOS archive passes on a clean checkout.
- The QA backend and production backend are both live and reachable.
- App Review / Play Review demo credentials are available and tested.
- All login flows are testable by the reviewer.
- Firebase Phone Auth works on production builds.
- Production push notifications work on real iPhone and Android devices.
- Crash reporting is enabled and verified.
- App does not crash on cold start, login, onboarding, card creation, card edit, matches, archive, logs, statistics, and contact requests.

## Apple App Review readiness

- Provide an active demo admin or matchmaker account in App Store Connect review notes.
- Explain that the app is a managed matchmaking tool and not a casual dating or hookup app.
- Explain any non-obvious flows in review notes: candidate login, matchmaker login, card creation, matches, archive, logs, statistics, and notifications.
- Make sure all backend services are live during review.
- Add a public Privacy Policy URL.
- Add a public Support URL.
- Add Terms of Use / Terms of Service URL.
- Add an in-app way to request account deletion or data deletion.
- Add an in-app way to contact support.
- Add a moderation/reporting process for user-submitted profiles or photos.
- Make sure age rating answers match the real app content.
- Make sure screenshots and metadata do not mention Android or external platforms.
- Make sure the app name, subtitle, keywords, and screenshots accurately describe the app.
- Complete App Privacy details in App Store Connect for all collected data.
- Verify whether an iOS Privacy Manifest is required for the app target and installed SDKs.

## Google Play readiness

- Production Android App Bundle builds successfully.
- App signing is configured in Play Console.
- Version code is incremented for every release.
- Data Safety form is complete and matches actual collection/sharing.
- Privacy Policy URL is configured.
- Account deletion URL is configured when account creation is available.
- Target SDK and permissions comply with current Play requirements.
- Push notification permission flow is tested on Android 13+.

## Current technical gaps to close

- Add real React Native and TypeScript test infrastructure.
- Add smoke tests for critical screens and flows.
- Replace temporary lenient ESLint config with a full TypeScript-aware config.
- Refresh package-lock and return CI to npm ci.
- Fix server and dev scripts if backend/server.js is the only backend entry point.
- Validate iOS archive with production Firebase and APNs configuration.
- Validate Android release with production Firebase SHA-1/SHA-256.
