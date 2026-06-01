import React, {useEffect, useMemo, useState} from 'react';
import {AxiosError} from 'axios';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Modal, Platform, Text, TouchableOpacity, View} from 'react-native';

import HomeScreen from '../HomeScreen/HomeScreen';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import CustomText from '../../components/CustomText/CustomText';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomTab from '../../components/CustomTab/CustomTab';
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner';

import {styles} from './Login.style';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {useLanguage} from '../../utils/LanguageProvider';
import {UserRole, isSessionValid, saveSession} from '../../services/session';
import {registerForPushNotifications} from '../../services/pushNotifications';
import {loginWithPassword} from '../../services/auth';

type LoginMode = 'matchmaker' | 'candidate';

const Login = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {t, language, changeLanguage, isRTL} = useLanguage();

  const [activeMode, setActiveMode] = useState<LoginMode>('matchmaker');
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [matchmakerCode, setMatchmakerCode] = useState('');
  const [errorKey, setErrorKey] = useState<string | null>(null);

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

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'MainScreen'}],
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
    setErrorKey(null);

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
      setErrorKey('errorRequiredFields');
      return;
    }

    if (!/^\d{10}$/.test(cleanMobile)) {
      setErrorKey('invalidPhone');
      return;
    }

    if (!isMatchmakerLogin && !/^\d{10}$/.test(cleanMatchmakerCode)) {
      setErrorKey('invalidPhone');
      return;
    }

    try {
      setErrorKey(null);
      setIsSubmitting(true);

      let role: UserRole = isMatchmakerLogin ? 'matchmaker' : 'user';
      let hasBackendSession = false;

      if (isMatchmakerLogin) {
        const user = await loginWithPassword(cleanMobile, cleanPassword);
        role = user.role;
        hasBackendSession = true;
      } else {
        await saveSession(role, {
          phone: cleanMobile,
        });
      }

      if (hasBackendSession) {
        const pushResult = await registerForPushNotifications();

        if (__DEV__) {
          const platformLabel = Platform.OS === 'ios' ? 'iOS' : 'Android';

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
              params: {showCongratsAfterLogin: true},
            },
          ],
        }),
      );
    } catch (err) {
      const error = err as AxiosError<{message?: string}>;

      if (__DEV__) {
        console.warn('Login failed', error);
      }

      if (error.response?.status === 401) {
        setErrorKey('invalidCredentials');
      } else if (error.response) {
        setErrorKey('errorServer');
      } else if (error.request) {
        setErrorKey('errorNoResponse');
      } else {
        setErrorKey('errorGeneric');
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
                  keyboardType="numeric"
                  inputMode="numeric"
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
                    keyboardType="numeric"
                    inputMode="numeric"
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

          {errorKey && (
            <View style={styles.errorContainerBottom}>
              <ErrorBanner message={errorKey} />
            </View>
          )}
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
    </>
  );
};

export default Login;
