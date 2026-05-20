import React, { useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import { loginWithPassword } from '../../services/auth';

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
  const [error, setError] = useState<string | null>(null);

  const tabModes = useMemo<LoginMode[]>(
    () => (isRTL ? ['candidate', 'matchmaker'] : ['matchmaker', 'candidate']),
    [isRTL],
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

  const handleTabPress = (index: number) => {
    const nextMode = tabModes[index];

    if (nextMode) {
      setActiveMode(nextMode);
      setError(null);
    }
  };

  const handleLoginApp = async () => {
    const requiredSecret = isMatchmakerLogin ? password : matchmakerCode;

    if (!mobile || !requiredSecret) {
      setError(t('errorRequiredFields'));
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setError(t('invalidPhone'));
      return;
    }

    if (!isMatchmakerLogin && !/^\d{10}$/.test(matchmakerCode)) {
      setError(t('invalidPhone'));
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);

      if (isMatchmakerLogin) {
        await loginWithPassword(mobile, password);
      }

      navigation.navigate('MainScreen');
    } catch {
      setError(t('errorGeneric'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <View style={[styles.container, isRTL ? styles.rtl : styles.ltr]}>
        <HomeScreen>
          <View style={styles.langSwitchContainer}>
            <TouchableOpacity
              onPress={() => setLangModalVisible(true)}
              style={styles.langSwitchButton}
              accessibilityLabel="Select language"
            >
              <View style={[styles.langRow, isRTL ? styles.rowReverse : styles.row]}>
                <Text style={styles.langSwitchText}>🌐</Text>
                <Text style={styles.langSwitchText}>{language.toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <CustomText text="welcome" customStyle={styles.title} />

          <WhiteCard
            customStyle={[
              styles.whiteCardContainer,
              isRTL ? styles.rtl : styles.ltr,
            ]}
            key={language} // force rerender on language change
          >
            <View
              style={[
                styles.formContent,
                isRTL ? styles.rtl : styles.ltr,
              ]}
            >
              <CustomTab tabs={tabs} activeTab={activeTab} onTabPress={handleTabPress} />

              <View style={styles.space}>
                <CustomInput
                  placeholder={t('phoneNumber')}
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
                    placeholder={t('password')}
                    keyboardType="default"
                    secureTextEntry
                    allowToggleSecure
                    value={password}
                    onChangeText={setPassword}
                  />
                ) : (
                  <CustomInput
                    placeholder={t('matchmakerCode')}
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
                <CustomButton text="login" onPress={handleLoginApp} isDisabled={isSubmitting} />
              </View>
            </View>
          </WhiteCard>

          {error && (
            <View style={styles.errorContainerBottom}>
              <ErrorBanner message={error} />
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
            <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
            {languages.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={styles.modalOption}
                onPress={() => {
                  changeLanguage(lang.code);
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
