import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { AxiosError } from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import HomeScreen from '../HomeScreen/HomeScreen';
import CustomRadioButton from '../../components/CustomRadioButton/CustomRadioButton';

import { styles } from './RegisterUserScreen.style';
import { RootStackParamList } from '../../components/MainStackNavigation/MainStackNavigation.type';
import { useLanguage } from '../../utils/LanguageProvider';
import api from '../../services/api';

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'RegisterUserScreen'
>;

interface Props {
  navigation: NavigationProp;
}

const RegisterUserScreen = ({ navigation: _navigation }: Props) => {
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const { t } = useLanguage();

  const handleRegister = async () => {
    if (!fullName || !phone || !email || !password) {
      Alert.alert(t('error'), t('errorRequiredFields'));
      return;
    }

    if (!/^\d{9,10}$/.test(phone)) {
      Alert.alert(t('error'), t('invalidPhone'));
      return;
    }

    try {
      await api.post('/api/users/register-user', {
        fullName,
        phone,
        email,
        gender,
        password,
      });

      Alert.alert(t('success'), t('userRegistered'));
      // navigation.navigate('Login');
    } catch (err) {
      const error = err as AxiosError<any>;

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
    }
  };

  return (
    <HomeScreen>
      <WhiteCard>
        <View style={styles.space}>
          <CustomInput
            placeholder={t('fullName')}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.space}>
          <CustomInput
            placeholder={t('mobile')}
            keyboardType="numeric"
            inputMode="numeric"
            onlyDigits
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.space}>
          <CustomInput
            placeholder={t('email')}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.space}>
          <CustomInput
            placeholder={t('password')}
            secureTextEntry
            allowToggleSecure
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.space}>
          <CustomRadioButton
            text={t('gender')}
              radiosArray={[
                { id: 1, name: 'male', label: t('male') },
                { id: 2, name: 'female', label: t('female') },
              ]}
            onSelect={option => {
              if (option) setGender(option.name as 'male' | 'female');
            }}
          />
        </View>

        <CustomButton text={t('registerUser')} onPress={handleRegister} />
      </WhiteCard>
    </HomeScreen>
  );
};

export default RegisterUserScreen;
