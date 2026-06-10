import React, {useState} from 'react';
import {View} from 'react-native';
import {AxiosError} from 'axios';
import {StackNavigationProp} from '@react-navigation/stack';
import {useFocusEffect} from '@react-navigation/native';

import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomText from '../../components/CustomText/CustomText';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import HomeScreen from '../HomeScreen/HomeScreen';
import CustomRadioButton from '../../components/CustomRadioButton/CustomRadioButton';

import {styles} from './RegisterUserScreen.style';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {useLanguage} from '../../utils/LanguageProvider';
import {useMessage} from '../../utils/MessageProvider';
import api from '../../services/api';

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'RegisterUserScreen'
>;

interface Props {
  navigation: NavigationProp;
}

const RegisterUserScreen = ({navigation}: Props) => {
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const {t} = useLanguage();
  const {showMessage} = useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setFullName('');
      setPhone('');
      setEmail('');
      setPassword('');
      setGender('female');
    }, []),
  );

  const handleRegister = async () => {
    if (isSubmitting) {
      return;
    }

    const cleanFullName = fullName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanFullName || !cleanPhone || !cleanEmail || !cleanPassword) {
      showMessage({type: 'error', message: t('errorRequiredFields')});
      return;
    }

    if (!/^05\d{8}$/.test(cleanPhone)) {
      showMessage({type: 'error', message: t('invalidPhone')});
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showMessage({type: 'error', message: t('invalidEmail')});
      return;
    }

    if (cleanPassword.length < 6) {
      showMessage({type: 'error', message: t('passwordTooShort')});
      return;
    }

    try {
      setIsSubmitting(true);

      await api.post('/api/users/register', {
        fullName: cleanFullName,
        phone: cleanPhone,
        email: cleanEmail,
        gender,
        password: cleanPassword,
      });

      showMessage({type: 'success', message: t('matchmakerRegistered')});
      navigation.navigate('UsersList');
    } catch (err) {
      const error = err as AxiosError<{message?: string}>;

      if (error.response) {
        showMessage({
          type: 'error',
          message: error.response.data?.message || t('errorServer'),
        });
      } else if (error.request) {
        showMessage({type: 'error', message: t('errorNoResponse')});
      } else {
        showMessage({
          type: 'error',
          message: error.message || t('errorGeneric'),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HomeScreen>
      <View style={styles.container}>
        <CustomText text="registerUser" customStyle={styles.title} />
        <CustomText text="registerUserSubtitle" customStyle={styles.subtitle} />

        <WhiteCard customStyle={styles.card}>
          <View style={styles.field}>
            <CustomInput
              text={`* ${t('fullName')}`}
              placeholder="fullName"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.field}>
            <CustomInput
              text={`* ${t('mobile')}`}
              placeholder="mobile"
              keyboardType="phone-pad"
              inputMode="tel"
              onlyDigits
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.field}>
            <CustomInput
              text={`* ${t('email')}`}
              placeholder="email"
              keyboardType="email-address"
              inputMode="email"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.field}>
            <CustomInput
              placeholder={`${t('password')} *`}
              secureTextEntry
              allowToggleSecure
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={[styles.field, styles.genderField]}>
            <CustomRadioButton
              text="gender"
              value={gender}
              radiosArray={[
                {id: 1, name: 'male', label: 'male'},
                {id: 2, name: 'female', label: 'female'},
              ]}
              onSelect={option => {
                if (option) setGender(option.name as 'male' | 'female');
              }}
            />
          </View>

          <CustomButton
            text={isSubmitting ? 'loading' : 'registerUser'}
            customStyle={styles.submitButton}
            customTextStyle={styles.submitButtonText}
            onPress={handleRegister}
            isDisabled={isSubmitting}
          />
        </WhiteCard>
      </View>
    </HomeScreen>
  );
};

export default RegisterUserScreen;
