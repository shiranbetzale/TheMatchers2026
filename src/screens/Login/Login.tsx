import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import HomeScreen from '../HomeScreen/HomeScreen';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import CustomText from '../../components/CustomText/CustomText';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomTab from '../../components/CustomTab/CustomTab';
import { styles } from './Login.style';
import { RootStackParamList } from '../../components/MainStackNavigation/MainStackNavigation.type';
import { useLanguage } from '../../utils/LanguageProvider';
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner';
import {UserRole, isSessionValid, saveSession} from '../../services/session';
import {registerForPushNotifications} from '../../services/pushNotifications';
import {loginWithPassword} from '../../services/auth';

type LoginMode = 'matchmaker' | 'candidate';

const Login = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeMode, setActiveMode] = useState<LoginMode>('matchmaker');
  const { t, language, changeLanguage, isRTL } = useLanguage();
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const languages = useMemo(
    () => [
      { code: 'he', label: 'עברית' },
      { code: 'en', label: 'English' },
    ],
    [],
  );

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [matchmakerCode, setMatchmakerCode] = useState('');
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const tabModes = useMemo<LoginMode[]>(
    () => ['matchmaker', 'candidate'],
    [],
  );

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
    const redirectActiveSession = async () => {
      if (await isSessionValid()) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'MainScreen'}],
          }),
        );
      }
    };

    redirectActiveSession();
  }, [navigation]);

  const handleTabPress = (index: number) => {
    const nextMode = tabModes[index];

    if (nextMode) {
      setActiveMode(nextMode);
      setErrorKey(null);
    }
  };

  const handleLoginApp = async () => {
    const requiredSecret = isMatchmakerLogin ? password : matchmakerCode;

    if (!mobile || !requiredSecret) {
      setErrorKey('errorRequiredFields');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setErrorKey('invalidPhone');
      return;
    }

    if (!isMatchmakerLogin && !/^\d{10}$/.test(matchmakerCode)) {
      setErrorKey('invalidPhone');
      return;
    }

    try {
      setErrorKey(null);
      setIsSubmitting(true);

      let role: UserRole = isMatchmakerLogin ? 'matchmaker' : 'user';

      if (isMatchmakerLogin) {
        try {
          const user = await loginWithPassword(mobile, password);
          role = user.role;
        } catch (loginError) {
          console.warn('Backend login failed; using local session fallback', loginError);
        }
      }

      await saveSession(role, {
        phone: mobile,
      });
      registerForPushNotifications();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {name: 'MainScreen', params: {showCongratsAfterLogin: true}},
          ],
        }),
      );
    } catch {
      setErrorKey('errorGeneric');
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
              accessibilityLabel={t('selectLanguage')}
            >
              <View style={[styles.langRow, isRTL ? styles.rowReverse : styles.row]}>
                <Text style={styles.langSwitchText}>🌐</Text>
                <Text style={styles.langSwitchText}>{language.toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <WhiteCard
            customStyle={styles.whiteCardContainer}
            key={language} // force rerender on language change
          >
            <View style={styles.formContent}>
              <View style={styles.heroContent}>
                <View style={styles.brandMark}>
                  <Text style={styles.brandMarkText}>TM</Text>
                </View>
                <CustomText text="loginEyebrow" customStyle={styles.eyebrow} />
                <CustomText text="welcome" customStyle={styles.title} />
                <CustomText text="loginSubtitle" customStyle={styles.subtitle} />
              </View>

              <CustomTab tabs={tabs} activeTab={activeTab} onTabPress={handleTabPress} />

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
                    secureTextEntry
                    allowToggleSecure
                    maxLength={10}
                    value={matchmakerCode}
                    onChangeText={setMatchmakerCode}
                  />
                )}
              </View>

              <View style={styles.space}>
                <CustomButton
                  text="login"
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
        onRequestClose={() => setLangModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setLangModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <CustomText text="selectLanguage" customStyle={styles.modalTitle} />
            {languages.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={styles.modalOption}
                onPress={async () => {
                  await changeLanguage(lang.code);
                  setLangModalVisible(false);
                }}
              >
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
