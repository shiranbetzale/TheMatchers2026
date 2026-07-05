import {AxiosError} from 'axios';

type Translate = (key: string) => string;
type ShowMessage = (options: {type: 'error'; message: string}) => void;

export const getFirebasePhoneErrorKey = (error: unknown) => {
  const errorObject = error as {
    code?: string;
    nativeErrorCode?: string;
    _code?: string;
    message?: string;
    _message?: string;
    nativeErrorMessage?: string;
    userInfo?: {code?: string; message?: string};
  };
  const message = String(
    errorObject?.message ||
      errorObject?._message ||
      errorObject?.nativeErrorMessage ||
      errorObject?.userInfo?.message ||
      '',
  );
  const messageCodeMatch = message.match(/\[(auth\/[^\]]+)\]/);
  const code = String(
    errorObject?.code ||
      errorObject?._code ||
      errorObject?.nativeErrorCode ||
      errorObject?.userInfo?.code ||
      messageCodeMatch?.[1] ||
      '',
  );

  if (code === 'auth/operation-not-allowed') {
    return 'firebasePhoneAuthNotEnabled';
  }

  if (
    code === 'auth/app-not-authorized' ||
    code === 'auth/invalid-app-credential' ||
    code === 'auth/missing-client-identifier' ||
    code === 'auth/missing-app-credential'
  ) {
    return 'firebasePhoneAuthSetupError';
  }

  if (code === 'auth/invalid-phone-number') return 'invalidPhone';
  if (code === 'auth/too-many-requests' || code === 'auth/quota-exceeded') {
    return 'firebasePhoneAuthQuotaExceeded';
  }
  if (code === 'auth/network-request-failed') return 'noInternetConnection';
  if (code === 'auth/invalid-verification-code') {
    return 'invalidCandidateCode';
  }
  if (code === 'auth/session-expired') return 'candidateCodeExpired';

  return null;
};

export const getFirebasePhoneFallbackMessage = (error: unknown) => {
  const errorObject = error as {
    message?: string;
    _message?: string;
    nativeErrorMessage?: string;
    userInfo?: {message?: string};
  };
  const message = String(
    errorObject?.message ||
      errorObject?._message ||
      errorObject?.nativeErrorMessage ||
      errorObject?.userInfo?.message ||
      '',
  ).trim();

  return message ? message.replace(/\[[^\]]+\]\s*/, '').trim() : '';
};

export const showCandidateAuthError = (
  error: AxiosError<{message?: string}>,
  rawError: unknown,
  isCandidateLoginAttempt: boolean,
  t: Translate,
  showMessage: ShowMessage,
) => {
  const firebaseErrorKey = getFirebasePhoneErrorKey(rawError);
  const firebaseFallbackMessage = getFirebasePhoneFallbackMessage(rawError);

  if (isCandidateLoginAttempt && firebaseErrorKey) {
    showMessage({type: 'error', message: t(firebaseErrorKey)});
  } else if (error.response?.status === 401 && !isCandidateLoginAttempt) {
    showMessage({type: 'error', message: t('invalidCredentials')});
  } else if (isCandidateLoginAttempt && error.response?.status === 404) {
    showMessage({type: 'error', message: t('matchmakerNotFound')});
  } else if (error.response) {
    showMessage({
      type: 'error',
      message: isCandidateLoginAttempt
        ? t('firebasePhoneAuthServerPrecheckError')
        : t('errorServer'),
    });
  } else if (error.request) {
    showMessage({type: 'error', message: t('errorNoResponse')});
  } else if (isCandidateLoginAttempt && firebaseFallbackMessage) {
    showMessage({type: 'error', message: firebaseFallbackMessage});
  } else {
    showMessage({
      type: 'error',
      message: isCandidateLoginAttempt
        ? t('firebasePhoneAuthUnknownError')
        : t('errorGeneric'),
    });
  }
};
