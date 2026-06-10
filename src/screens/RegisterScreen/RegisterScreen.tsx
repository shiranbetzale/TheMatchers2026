import React, {useState} from 'react';
import {View} from 'react-native';
import {AxiosError} from 'axios';
import {StackNavigationProp} from '@react-navigation/stack';

import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomText from '../../components/CustomText/CustomText';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import HomeScreen from '../HomeScreen/HomeScreen';
import CustomRadioButton from '../../components/CustomRadioButton/CustomRadioButton';

import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {styles} from './RegisterScreen.style';
import {useLanguage} from '../../utils/LanguageProvider';
import {useMessage} from '../../utils/MessageProvider';
import api from '../../services/api';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: NavigationProp;
}

const RegisterScreen = ({navigation}: Props) => {
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('female');

  const {t} = useLanguage();
  const {showMessage} = useMessage();

  const handleSave = async () => {
    const cleanFullName = fullName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (
      !cleanFullName ||
      !cleanPhone ||
      !cleanEmail ||
      !cleanPassword
    ) {
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

    try {
      await api.post('/api/users/register', {
        fullName: cleanFullName,
        phone: cleanPhone,
        email: cleanEmail,
        password: cleanPassword,
        gender,
      });

      showMessage({type: 'success', message: t('matchmakerRegistered')});
      navigation.navigate('UsersList');
    } catch (err) {
      const error = err as AxiosError<any>;

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
    }
  };

  return (
    <View style={styles.container}>
      <HomeScreen>
        <CustomText
          text={'registerMatchmakerTitle'}
          customStyle={styles.title}
        />

        <WhiteCard customStyle={styles.whiteCardContainer}>
          <CustomInput
            text={`* ${t('fullName')}`}
            placeholder="fullName"
            value={fullName}
            onChangeText={setFullName}
          />

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

          <CustomInput
            text={`* ${t('email')}`}
            placeholder="email"
            keyboardType="email-address"
            inputMode="email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <CustomInput
            text={`* ${t('password')}`}
            placeholder="password"
            secureTextEntry
            allowToggleSecure
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.space}>
            <CustomRadioButton
              text={`* ${t('gender')}`}
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

          <View style={styles.space}>
            <CustomButton text="save" onPress={handleSave} />
          </View>
        </WhiteCard>
      </HomeScreen>
    </View>
  );
};

export default RegisterScreen;
