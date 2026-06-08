import React, {useState} from 'react';
import {AxiosError} from 'axios';
import {View} from 'react-native';

import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomText from '../../components/CustomText/CustomText';
import WhiteCard from '../../components/WhiteCard/WhiteCard';

import api from '../../services/api';
import {useLanguage} from '../../utils/LanguageProvider';
import {useMessage} from '../../utils/MessageProvider';

import HomeScreen from '../HomeScreen/HomeScreen';
import {styles} from './ContactScreen.style';

const ContactScreen = () => {
  const {t} = useLanguage();
  const {showMessage} = useMessage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const isValidPhone = (value: string) => {
    const cleanPhone = value.trim();

    if (!cleanPhone) {
      return true;
    }

    return /^05\d{8}$/.test(cleanPhone);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      showMessage({type: 'error', message: t('errorRequiredFields')});
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      showMessage({type: 'error', message: t('invalidEmail')});
      return;
    }

    if (!isValidPhone(trimmedPhone)) {
      showMessage({type: 'error', message: t('invalidPhone')});
      return;
    }

    try {
      setIsSubmitting(true);

      await api.post('/api/contact', {
        name: trimmedName,
        email: trimmedEmail.toLowerCase(),
        phone: trimmedPhone,
        message: trimmedMessage,
      });

      resetForm();

      showMessage({type: 'success', message: t('contactSent')});
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
        field?: string;
      }>;

      const payload = axiosError.response?.data;

      const serverMessage = payload?.message;

      const fallbackServerReason =
        payload?.error && payload?.field
          ? `${payload.error}: ${payload.field}`
          : payload?.error;

      showMessage({
        type: 'error',
        message:
          serverMessage ||
          fallbackServerReason ||
          axiosError.message ||
          t('contactSendError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HomeScreen>
      <View style={styles.container}>
        <CustomText text="contactTitle" customStyle={styles.title} />

        <CustomText text="contactSubtitle" customStyle={styles.subtitle} />

        <WhiteCard customStyle={styles.card}>
          <View style={styles.field}>
            <CustomInput
              placeholder="fullName"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.field}>
            <CustomInput
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
              placeholder="phoneNumber"
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
              placeholder="contactMessage"
              isMultiline
              value={message}
              onChangeText={setMessage}
            />
          </View>

          <CustomButton
            text={isSubmitting ? 'sending' : 'send'}
            isDisabled={isSubmitting}
            onPress={handleSubmit}
          />
        </WhiteCard>
      </View>
    </HomeScreen>
  );
};

export default ContactScreen;
