import React, {useEffect, useState} from 'react';
import {AxiosError} from 'axios';
import {View} from 'react-native';

import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomText from '../../components/CustomText/CustomText';
import WhiteCard from '../../components/WhiteCard/WhiteCard';

import api from '../../services/api';
import {getSessionUser} from '../../services/session';
import {useLanguage} from '../../utils/LanguageProvider';
import {useMessage} from '../../utils/MessageProvider';

import HomeScreen from '../HomeScreen/HomeScreen';
import {styles} from './ContactScreen.style';

type ContactResponse = {
  ok?: boolean;
  saved?: boolean;
};

type ContactDetails = {
  name: string;
  email: string;
  phone: string;
};

const EMPTY_CONTACT_DETAILS: ContactDetails = {
  name: '',
  email: '',
  phone: '',
};

const normalizeIsraeliPhone = (value?: string) => {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.startsWith('972') ? `0${digits.slice(3)}` : digits;
};

const ContactScreen = () => {
  const {t} = useLanguage();
  const {showMessage} = useMessage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingDeletion, setIsSubmittingDeletion] = useState(false);
  const [contactDefaults, setContactDefaults] = useState<ContactDetails>(
    EMPTY_CONTACT_DETAILS,
  );

  useEffect(() => {
    let isMounted = true;

    getSessionUser().then(sessionUser => {
      if (
        !isMounted ||
        !sessionUser ||
        (sessionUser.role !== 'matchmaker' && sessionUser.role !== 'admin')
      ) {
        return;
      }

      const defaults = {
        name: sessionUser.name || '',
        email: sessionUser.email || '',
        phone: normalizeIsraeliPhone(sessionUser.phone),
      };

      setContactDefaults(defaults);
      setName(defaults.name);
      setEmail(defaults.email);
      setPhone(defaults.phone);
    });

    return () => {
      isMounted = false;
    };
  }, []);

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
    setName(contactDefaults.name);
    setEmail(contactDefaults.email);
    setPhone(contactDefaults.phone);
    setMessage('');
  };

  const validateContactDetails = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      showMessage({type: 'error', message: t('errorRequiredFields')});
      return null;
    }

    if (!isValidEmail(trimmedEmail)) {
      showMessage({type: 'error', message: t('invalidEmail')});
      return null;
    }

    if (!isValidPhone(trimmedPhone)) {
      showMessage({type: 'error', message: t('invalidPhone')});
      return null;
    }

    return {
      name: trimmedName,
      email: trimmedEmail.toLowerCase(),
      phone: trimmedPhone,
      message: trimmedMessage,
    };
  };

  const getServerErrorMessage = (error: unknown) => {
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

    return (
      serverMessage ||
      fallbackServerReason ||
      axiosError.message ||
      t('contactSendError')
    );
  };

  const handleSubmit = async () => {
    if (isSubmitting || isSubmittingDeletion) {
      return;
    }

    const payload = validateContactDetails();

    if (!payload) {
      return;
    }

    try {
      setIsSubmitting(true);

      await api.post<ContactResponse>('/api/contact', payload);

      resetForm();

      showMessage({type: 'success', message: t('contactSent')});
    } catch (error) {
      showMessage({
        type: 'error',
        message: getServerErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccountDeletionRequest = async () => {
    if (isSubmitting || isSubmittingDeletion) {
      return;
    }

    const payload = validateContactDetails();

    if (!payload) {
      return;
    }

    try {
      setIsSubmittingDeletion(true);

      await api.post<ContactResponse>('/api/contact/account-deletion', payload);

      resetForm();

      showMessage({type: 'success', message: t('accountDeletionRequestSent')});
    } catch (error) {
      showMessage({
        type: 'error',
        message: getServerErrorMessage(error),
      });
    } finally {
      setIsSubmittingDeletion(false);
    }
  };

  return (
    <HomeScreen>
      <View style={styles.container}>
        <CustomText text="contactTitle" customStyle={styles.title} />

        <CustomText text="contactSubtitle" customStyle={styles.subtitle} />

        <WhiteCard customStyle={styles.card}>
          <View style={styles.fieldsContainer}>
            <View style={styles.field}>
              <CustomInput
                text={`* ${t('fullName')}`}
                placeholder="fullName"
                value={name}
                onChangeText={setName}
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
                text={`* ${t('phoneNumber')}`}
                placeholder="phoneNumber"
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
                text={`* ${t('contactMessage')}`}
                placeholder="contactMessage"
                isMultiline
                value={message}
                onChangeText={setMessage}
              />
            </View>
          </View>

          <CustomButton
            text={isSubmitting ? 'sending' : 'send'}
            isDisabled={isSubmitting || isSubmittingDeletion}
            onPress={handleSubmit}
          />

          <CustomText
            text="accountDeletionHelp"
            customStyle={styles.deletionHelpText}
          />

          <CustomButton
            text={isSubmittingDeletion ? 'sending' : 'requestAccountDeletion'}
            isDisabled={isSubmitting || isSubmittingDeletion}
            customStyle={styles.deletionButton}
            onPress={handleAccountDeletionRequest}
          />
        </WhiteCard>
      </View>
    </HomeScreen>
  );
};

export default ContactScreen;
