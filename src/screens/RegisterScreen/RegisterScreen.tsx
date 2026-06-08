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
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      showMessage({type: 'error', message: t('errorRequiredFields')});
      return;
    }

    if (!/^\d{9,10}$/.test(phone)) {
      showMessage({type: 'error', message: t('invalidPhone')});
      return;
    }

    try {
      await api.post('/api/users/register', {
        fullName,
        phone,
        email,
        password,
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
            placeholder="fullName"
            value={fullName}
            onChangeText={setFullName}
          />

          <CustomInput
            placeholder="mobile"
            keyboardType="numeric"
            inputMode="numeric"
            onlyDigits
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />

          <CustomInput
            placeholder="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <CustomInput
            placeholder="password"
            secureTextEntry
            allowToggleSecure
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.space}>
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

          <View style={styles.space}>
            <CustomButton text="save" onPress={handleSave} />
          </View>
        </WhiteCard>
      </HomeScreen>
    </View>
  );
};

export default RegisterScreen;
