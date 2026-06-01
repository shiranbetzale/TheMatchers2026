import React, {useState} from 'react';
import {View, Alert} from 'react-native';
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
      Alert.alert(t('error'), t('errorRequiredFields'));
      return;
    }

    if (!/^\d{9,10}$/.test(cleanPhone)) {
      Alert.alert(t('error'), t('invalidPhone'));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Alert.alert(t('error'), t('invalidEmail'));
      return;
    }

    if (cleanPassword.length < 6) {
      Alert.alert(t('error'), t('passwordTooShort'));
      return;
    }

    try {
      setIsSubmitting(true);

      await api.post('/api/users/register-user', {
        fullName: cleanFullName,
        phone: cleanPhone,
        email: cleanEmail,
        gender,
        password: cleanPassword,
      });

      Alert.alert(t('success'), t('userRegistered'));
      navigation.navigate('UsersList');
    } catch (err) {
      const error = err as AxiosError<{message?: string}>;

      if (error.response) {
        Alert.alert(
          t('error'),
          error.response.data?.message || t('errorServer'),
        );
      } else if (error.request) {
        Alert.alert(t('error'), t('errorNoResponse'));
      } else {
        Alert.alert(t('error'), error.message || t('errorGeneric'));
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
              placeholder="fullName"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.field}>
            <CustomInput
              placeholder="mobile"
              keyboardType="numeric"
              inputMode="numeric"
              onlyDigits
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.field}>
            <CustomInput
              placeholder="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.field}>
            <CustomInput
              placeholder="password"
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
