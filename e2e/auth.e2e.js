const MATCHMAKER_PHONE = '0500000001';
const MATCHMAKER_PASSWORD = 'e2e-matchmaker';
const CANDIDATE_PHONE = '0500000002';
const CANDIDATE_CODE = '123456';

async function openLogin({deleteAppData = true} = {}) {
  await device.launchApp({
    newInstance: true,
    delete: deleteAppData,
    permissions: {notifications: 'YES'},
  });

  try {
    await waitFor(element(by.id('input-phoneNumber')))
      .toBeVisible()
      .withTimeout(3000);
  } catch (_error) {
    await waitFor(element(by.id('button-skip')))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id('button-skip')).tap();
    await waitFor(element(by.id('input-phoneNumber')))
      .toBeVisible()
      .withTimeout(10000);
  }
}

async function selectCandidateMode() {
  await element(by.id('button-shidduchTab')).tap();
  await waitFor(element(by.id('input-matchmakerCode')))
    .toBeVisible()
    .withTimeout(5000);
}

describe('authentication E2E', () => {
  beforeEach(async () => {
    await openLogin();
  });

  it('shows the matchmaker login controls with stable test ids', async () => {
    await expect(element(by.id('input-phoneNumber'))).toBeVisible();
    await expect(element(by.id('input-password'))).toBeVisible();
    await expect(element(by.id('input-password-toggle-secure'))).toBeVisible();
    await expect(element(by.id('button-login'))).toBeVisible();
    await expect(element(by.id('button-matchmakerTab'))).toBeVisible();
    await expect(element(by.id('button-shidduchTab'))).toBeVisible();
  });

  it('keeps the user on login when required fields are missing', async () => {
    await element(by.id('button-login')).tap();
    await expect(element(by.id('input-phoneNumber'))).toBeVisible();
    await expect(element(by.id('input-password'))).toBeVisible();
  });

  it('keeps the user on login when the phone number is invalid', async () => {
    await element(by.id('input-phoneNumber')).replaceText('05012');
    await element(by.id('input-password')).replaceText('anything');
    await element(by.id('button-login')).tap();

    await expect(element(by.id('input-phoneNumber'))).toBeVisible();
  });

  it('logs a debug E2E matchmaker in without calling the backend', async () => {
    await element(by.id('input-phoneNumber')).replaceText(MATCHMAKER_PHONE);
    await element(by.id('input-password')).replaceText(MATCHMAKER_PASSWORD);
    await element(by.id('button-login')).tap();

    await waitFor(element(by.id('button-allCards')))
      .toBeVisible()
      .withTimeout(10000);
    await expect(element(by.id('input-phoneNumber'))).not.toBeVisible();
  });

  it('restores the matchmaker session after relaunch', async () => {
    await element(by.id('input-phoneNumber')).replaceText(MATCHMAKER_PHONE);
    await element(by.id('input-password')).replaceText(MATCHMAKER_PASSWORD);
    await element(by.id('button-login')).tap();
    await waitFor(element(by.id('button-allCards')))
      .toBeVisible()
      .withTimeout(10000);

    await device.launchApp({newInstance: true, delete: false});

    await waitFor(element(by.id('button-allCards')))
      .toBeVisible()
      .withTimeout(10000);
  });

  it('switches to candidate mode and exposes SMS and voice controls', async () => {
    await selectCandidateMode();

    await expect(element(by.id('input-phoneNumber'))).toBeVisible();
    await expect(element(by.id('input-matchmakerCode'))).toBeVisible();
    await expect(element(by.id('button-candidateVoiceCall'))).toBeVisible();
    await expect(element(by.id('button-login'))).toBeVisible();
  });

  it('completes candidate SMS verification without sending a real SMS', async () => {
    await selectCandidateMode();
    await element(by.id('input-phoneNumber')).replaceText(CANDIDATE_PHONE);
    await element(by.id('input-matchmakerCode')).replaceText(MATCHMAKER_PHONE);
    await element(by.id('button-login')).tap();

    await waitFor(element(by.id('input-candidateCodePlaceholder')))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id('input-candidateCodePlaceholder')).replaceText(
      CANDIDATE_CODE,
    );
    await element(by.id('button-confirm')).tap();

    await waitFor(element(by.id('input-phoneNumber')))
      .not.toBeVisible()
      .withTimeout(10000);
  });

  it('rejects an incorrect candidate verification code', async () => {
    await selectCandidateMode();
    await element(by.id('input-phoneNumber')).replaceText(CANDIDATE_PHONE);
    await element(by.id('input-matchmakerCode')).replaceText(MATCHMAKER_PHONE);
    await element(by.id('button-login')).tap();

    await waitFor(element(by.id('input-candidateCodePlaceholder')))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id('input-candidateCodePlaceholder')).replaceText('000000');
    await element(by.id('button-confirm')).tap();

    await expect(
      element(by.id('input-candidateCodePlaceholder')),
    ).toBeVisible();
  });

  it('completes candidate voice verification without placing a real call', async () => {
    await selectCandidateMode();
    await element(by.id('input-phoneNumber')).replaceText(CANDIDATE_PHONE);
    await element(by.id('input-matchmakerCode')).replaceText(MATCHMAKER_PHONE);
    await element(by.id('button-candidateVoiceCall')).tap();

    await waitFor(element(by.id('input-candidateCodePlaceholder')))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id('input-candidateCodePlaceholder')).replaceText(
      CANDIDATE_CODE,
    );
    await element(by.id('button-confirm')).tap();

    await waitFor(element(by.id('input-phoneNumber')))
      .not.toBeVisible()
      .withTimeout(10000);
  });
});
