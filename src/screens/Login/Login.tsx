import React, {useEffect, useMemo, useState} from 'react';
import {AxiosError} from 'axios';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Modal, Platform, Text, TouchableOpacity, View} from 'react-native';

import HomeScreen from '../HomeScreen/HomeScreen';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import CustomText from '../../components/CustomText/CustomText';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomTab from '../../components/CustomTab/CustomTab';

import {styles} from './Login.style';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {useLanguage} from '../../utils/LanguageProvider';
import {useMessage} from '../../utils/MessageProvider';
import {
  UserRole,
  getSessionRole,
  getSessionUser,
  isSessionValid,
  saveSession,
} from '../../services/session';
import {registerForPushNotifications} from '../../services/pushNotifications';
import {
  loginWithPassword,
  sendCandidateCode,
  verifyCandidateCode,
} from '../../services/auth';

type LoginMode = 'matchmaker' | 'candidate';

const getFirebasePhoneErrorKey = (error: unknown) => {
  const errorObject = error as {
    code?: string;
    nativeErrorCode?: string;
    _code?: string;
    message?: string;
    _message?: string;
    nativeErrorMessage?: string;
    userInfo?: {
      code?: string;
      message?: string;
    };
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

  if (code === 'auth/invalid-phone-number') {
    return 'invalidPhone';
  }

  if (code === 'auth/too-many-requests' || code === 'auth/quota-exceeded') {
    return 'firebasePhoneAuthQuotaExceeded';
  }

  if (code === 'auth/network-request-failed') {
    return 'errorNoResponse';
  }

  if (code === 'auth/invalid-verification-code') {
    return 'invalidCandidateCode';
  }

  if (code === 'auth/session-expired') {
    return 'candidateCodeExpired';
  }

  return null;
};

const getFirebasePhoneFallbackMessage = (error: unknown) => {
  const errorObject = error as {
    message?: string;
    _message?: string;
    nativeErrorMessage?: string;
    userInfo?: {
      message?: string;
    };
  };
  const message = String(
    errorObject?.message ||
      errorObject?._message ||
      errorObject?.nativeErrorMessage ||
      errorObject?.userInfo?.message ||
      '',
  ).trim();

  if (!message) {
    return '';
  }

  return message.replace(/\[[^\]]+\]\s*/, '').trim();
};

const showCandidateAuthError = (
  error: AxiosError<{message?: string}>,
  rawError: unknown,
  isCandidateLoginAttempt: boolean,
  t: (key: string) => string,
  showMessage: ReturnType<typeof useMessage>['showMessage'],
) => {
  const firebaseErrorKey = getFirebasePhoneErrorKey(rawError);
  const firebaseFallbackMessage = getFirebasePhoneFallbackMessage(rawError);

  if (isCandidateLoginAttempt && firebaseErrorKey) {
    showMessage({type: 'error', message: t(firebaseErrorKey)});
    return;
  }

  if (error.response?.status === 401 && !isCandidateLoginAttempt) {
    showMessage({type: 'error', message: t('invalidCredentials')});
    return;
  }

  if (isCandidateLoginAttempt && error.response?.status === 404) {
    showMessage({type: 'error', message: t('matchmakerNotFound')});
    return;
  }

  if (error.response) {
    showMessage({
      type: 'error',
      message: isCandidateLoginAttempt
        ? t('firebasePhoneAuthServerPrecheckError')
        : t('errorServer'),
    });
    return;
  }

  if (error.request) {
    showMessage({type: 'error', message: t('errorNoResponse')});
    return;
  }

  if (isCandidateLoginAttempt && firebaseFallbackMessage) {
    showMessage({type: 'error', message: firebaseFallbackMessage});
    return;
  }

  showMessage({
    type: 'error',
    message: isCandidateLoginAttempt
      ? t('firebasePhoneAuthUnknownError')
      : t('errorGeneric'),
  });
};

const Login = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {t, language, changeLanguage, isRTL} = useLanguage();
  const {showMessage} = useMessage();

  const [activeMode, setActiveMode] = useState<LoginMode>('matchmaker');
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [matchmakerCode, setMatchmakerCode] = useState('');
  const [candidateCode, setCandidateCode] = useState('');
  const [candidateCodeModalVisible, setCandidateCodeModalVisible] =
    useState(false);
  const [pendingCandidatePhone, setPendingCandidatePhone] = useState('');
  const [pendingMatchmakerPhone, setPendingMatchmakerPhone] = useState('');
  const [candidateConfirmation, setCandidateConfirmation] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const languages = useMemo(
    () => [
      {code: 'he', label: 'עברית'},
      {code: 'en', label: 'English'},
    ],
    [],
  );

  const tabModes = useMemo<LoginMode[]>(() => ['matchmaker', 'candidate'], []);

  const tabs = useMemo(
    () =>
      tabModes.map(mode => ({
        label: mode === 'matchmaker' ? 'matchmakerTab' : 'shidduchTab',
      })),
    [tabModes],
  );

  const activeTab = tabModes.indexOf(activeMode);
  const isMatchmakerLogin = activeMode === 'matchmaker';

  useEffect(() => {
    let isMounted = true;

    const redirectActiveSession = async () => {
      const validSession = await isSessionValid();

      if (!isMounted || !validSession) {
        return;
      }

      const [sessionRole, sessionUser] = await Promise.all([
        getSessionRole(),
        getSessionUser(),
      ]);

      if (!isMounted) {
        return;
      }

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes:
            sessionRole === 'user'
              ? [
                  {
                    name: 'Wizard',
                    params: {
                      mode: 'create',
                      resetToken: Date.now(),
                      candidatePhone: sessionUser?.phone,
                    },
                  },
                ]
              : [{name: 'MainScreen'}],
        }),
      );
    };

    redirectActiveSession();

    return () => {
      isMounted = false;
    };
  }, [navigation]);

  const handleTabPress = (index: number) => {
    const nextMode = tabModes[index];

    if (!nextMode) {
      return;
    }

    setActiveMode(nextMode);

    setPassword('');
    setMatchmakerCode('');
  };

  const handleLoginApp = async () => {
    if (isSubmitting) {
      return;
    }

    const cleanMobile = mobile.trim();
    const cleanPassword = password.trim();
    const cleanMatchmakerCode = matchmakerCode.trim();

    const requiredSecret = isMatchmakerLogin
      ? cleanPassword
      : cleanMatchmakerCode;

    if (!cleanMobile || !requiredSecret) {
      showMessage({type: 'error', message: t('errorRequiredFields')});
      return;
    }

    if (!/^05\d{8}$/.test(cleanMobile)) {
      showMessage({type: 'error', message: t('invalidPhone')});
      return;
    }

    if (!isMatchmakerLogin && !/^05\d{8}$/.test(cleanMatchmakerCode)) {
      showMessage({type: 'error', message: t('invalidPhone')});
      return;
    }

    try {
      setIsSubmitting(true);

      let role: UserRole = isMatchmakerLogin ? 'matchmaker' : 'user';
      let hasBackendSession = false;

      if (isMatchmakerLogin) {
        const user = await loginWithPassword(cleanMobile, cleanPassword);
        role = user.role;
        hasBackendSession = true;
      } else {
        const confirmation = await sendCandidateCode(
          cleanMobile,
          cleanMatchmakerCode,
        );
        setPendingCandidatePhone(cleanMobile);
        setPendingMatchmakerPhone(cleanMatchmakerCode);
        setCandidateConfirmation(confirmation);
        setCandidateCode('');
        setCandidateCodeModalVisible(true);
        return;
      }

      if (hasBackendSession) {
        const pushResult = await registerForPushNotifications();

        if (__DEV__) {
          const platformLabel = Platform.OS;

          const message = pushResult.ok
            ? `FCM token created (${platformLabel})`
            : pushResult.reason === 'permission_denied'
              ? `Notifications permission denied on ${platformLabel}`
              : pushResult.reason === 'token_missing'
                ? `No FCM token on ${platformLabel}`
                : `Push registration failed on ${platformLabel}${
                    pushResult.details ? `\n${pushResult.details}` : ''
                  }`;

          console.log('Push Debug', message);
        }
      } else if (__DEV__) {
        console.warn(
          'Skipping push registration because no backend session exists',
        );
      }

      setMobile('');
      setPassword('');
      setMatchmakerCode('');

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainScreen',
            },
          ],
        }),
      );
    } catch (err) {
      const error = err as AxiosError<{message?: string}>;
      const isCandidateLoginAttempt =
        !isMatchmakerLogin || Boolean(cleanMatchmakerCode);

      if (__DEV__) {
        console.warn('Login failed', error);
      }

      showCandidateAuthError(
        error,
        err,
        isCandidateLoginAttempt,
        t,
        showMessage,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCandidateCode = async () => {
    if (isSubmitting) {
      return;
    }

    const cleanCandidatePhone = pendingCandidatePhone.trim();
    const cleanMatchmakerPhone = pendingMatchmakerPhone.trim();
    const cleanCode = candidateCode.trim();

    if (!cleanCode) {
      showMessage({type: 'error', message: t('errorRequiredFields')});
      return;
    }

    try {
      setIsSubmitting(true);

      if (!candidateConfirmation) {
        showMessage({
          type: 'error',
          message: t('firebasePhoneAuthUnknownError'),
        });
        return;
      }

      const candidateAuth = await verifyCandidateCode({
        confirmation: candidateConfirmation,
        phone: cleanCandidatePhone,
        matchmakerPhone: cleanMatchmakerPhone,
        code: cleanCode,
      });
      await saveSession('user', {
        id: candidateAuth.user.id,
        phone: cleanCandidatePhone,
      });
      registerForPushNotifications();

      setMobile('');
      setPassword('');
      setMatchmakerCode('');
      setCandidateCode('');
      setCandidateConfirmation(null);
      setCandidateCodeModalVisible(false);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Wizard',
              params: {
                resetToken: Date.now(),
                mode: 'create',
                candidatePhone: cleanCandidatePhone,
                matchmakerPhone: cleanMatchmakerPhone,
              },
            },
          ],
        }),
      );
    } catch (err) {
      const error = err as AxiosError<{message?: string}>;
      const firebaseErrorKey = getFirebasePhoneErrorKey(err);
      const firebaseFallbackMessage = getFirebasePhoneFallbackMessage(err);

      if (__DEV__) {
        console.warn('Candidate verification failed', error);
      }

      if (firebaseErrorKey) {
        showMessage({type: 'error', message: t(firebaseErrorKey)});
      } else if (error.response?.status === 401) {
        showMessage({type: 'error', message: t('invalidCandidateCode')});
      } else if (error.response?.status === 404) {
        showMessage({type: 'error', message: t('matchmakerNotFound')});
      } else if (error.response) {
        showMessage({type: 'error', message: t('errorServer')});
      } else if (error.request) {
        showMessage({type: 'error', message: t('errorNoResponse')});
      } else {
        showMessage({
          type: 'error',
          message:
            firebaseFallbackMessage || t('firebasePhoneAuthUnknownError'),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <HomeScreen>
          <View style={styles.langSwitchContainer}>
            <TouchableOpacity
              onPress={() => setLangModalVisible(true)}
              style={styles.langSwitchButton}
              accessibilityLabel={t('selectLanguage')}>
              <View
                style={[
                  styles.langRow,
                  isRTL ? styles.rowReverse : styles.row,
                ]}>
                <Text style={styles.langSwitchText}>🌐</Text>
                <Text style={styles.langSwitchText}>
                  {language.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <WhiteCard customStyle={styles.whiteCardContainer}>
            <View style={styles.formContent}>
              <View style={styles.heroContent}>
                <View style={styles.brandMark}>
                  <Text style={styles.brandMarkText}>TM</Text>
                </View>

                <CustomText text="loginEyebrow" customStyle={styles.eyebrow} />
                <CustomText text="welcome" customStyle={styles.title} />
                <CustomText
                  text="loginSubtitle"
                  customStyle={styles.subtitle}
                />
              </View>

              <CustomTab
                tabs={tabs}
                activeTab={activeTab}
                onTabPress={handleTabPress}
              />

              <View style={styles.space}>
                <CustomInput
                  placeholder="phoneNumber"
                  keyboardType="phone-pad"
                  inputMode="tel"
                  onlyDigits
                  maxLength={10}
                  value={mobile}
                  onChangeText={setMobile}
                />
              </View>

              <View style={styles.space}>
                {isMatchmakerLogin ? (
                  <CustomInput
                    placeholder="password"
                    keyboardType="default"
                    secureTextEntry
                    allowToggleSecure
                    value={password}
                    onChangeText={setPassword}
                  />
                ) : (
                  <CustomInput
                    placeholder="matchmakerCode"
                    keyboardType="phone-pad"
                    inputMode="tel"
                    onlyDigits
                    maxLength={10}
                    value={matchmakerCode}
                    onChangeText={setMatchmakerCode}
                  />
                )}
              </View>

              <View style={styles.space}>
                <CustomButton
                  text={isSubmitting ? 'loading' : 'login'}
                  onPress={handleLoginApp}
                  isDisabled={isSubmitting}
                  customStyle={styles.loginButton}
                  customTextStyle={styles.loginButtonText}
                />
              </View>
            </View>
          </WhiteCard>
        </HomeScreen>
      </View>

      <Modal
        transparent
        visible={langModalVisible}
        animationType="slide"
        onRequestClose={() => setLangModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setLangModalVisible(false)}>
          <View style={styles.modalContent}>
            <CustomText text="selectLanguage" customStyle={styles.modalTitle} />
            {languages.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={styles.modalOption}
                onPress={async () => {
                  await changeLanguage(lang.code);
                  setLangModalVisible(false);
                }}>
                <Text style={styles.modalOptionText}>
                  {lang.label} ({lang.code.toUpperCase()})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        transparent
        visible={candidateCodeModalVisible}
        animationType="fade"
        onRequestClose={() => {
          setCandidateCodeModalVisible(false);
          setCandidateCode('');
          setCandidateConfirmation(null);
        }}>
        <View style={styles.codeModalOverlay}>
          <View style={styles.codeModalContent}>
            <View style={styles.codeModalHeader}>
              <CustomText
                text="candidateCodeTitle"
                customStyle={styles.codeModalTitle}
              />
              <TouchableOpacity
                style={styles.codeModalCloseButton}
                onPress={() => {
                  setCandidateCodeModalVisible(false);
                  setCandidateCode('');
                  setCandidateConfirmation(null);
                }}>
                <Text style={styles.codeModalCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <CustomText
              text="candidateCodeSubtitle"
              customStyle={[
                styles.codeModalSubtitle,
                isRTL ? styles.textRight : styles.textLeft,
              ]}
            />

            <View style={styles.space}>
              <CustomInput
                placeholder="candidateCodePlaceholder"
                keyboardType="number-pad"
                inputMode="numeric"
                onlyDigits
                maxLength={10}
                value={candidateCode}
                onChangeText={setCandidateCode}
              />
            </View>

            <View
              style={[
                styles.codeModalActions,
                isRTL ? styles.rowReverse : styles.row,
              ]}>
              <CustomButton
                text="cancel"
                onPress={() => {
                  setCandidateCodeModalVisible(false);
                  setCandidateCode('');
                  setCandidateConfirmation(null);
                }}
                isDisabled={isSubmitting}
                customStyle={styles.codeCancelButton}
                customTextStyle={styles.codeCancelButtonText}
              />
              <CustomButton
                text={isSubmitting ? 'loading' : 'confirm'}
                onPress={handleVerifyCandidateCode}
                isDisabled={isSubmitting}
                customStyle={styles.codeConfirmButton}
                customTextStyle={styles.codeConfirmButtonText}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Login;
