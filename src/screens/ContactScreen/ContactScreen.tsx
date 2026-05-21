import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomText from '../../components/CustomText/CustomText';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import api from '../../services/api';
import {sendEmail} from '../../utils/generalFunction';
import {useLanguage} from '../../utils/LanguageProvider';
import HomeScreen from '../HomeScreen/HomeScreen';
import {styles} from './ContactScreen.style';

const CONTACT_EMAIL = 'shiranbetzalel1990@gmail.com';

const ContactScreen = () => {
  const {t} = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert(t('error'), t('errorRequiredFields'));
      return;
    }

    try {
      setIsSubmitting(true);
      const contactPayload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
      };

      try {
        await api.post('/api/contact', contactPayload);
      } catch {
        await sendEmail(
          CONTACT_EMAIL,
          `TheMatchers contact: ${contactPayload.name}`,
          [
            `Name: ${contactPayload.name}`,
            `Email: ${contactPayload.email}`,
            `Phone: ${contactPayload.phone || '-'}`,
            '',
            'Message:',
            contactPayload.message,
          ].join('\n'),
        );
      }

      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      Alert.alert(t('success'), t('contactSent'));
    } catch {
      Alert.alert(t('error'), t('contactSendError'));
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
              placeholder={t('fullName')}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.field}>
            <CustomInput
              placeholder={t('email')}
              keyboardType="email-address"
              inputMode="text"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.field}>
            <CustomInput
              placeholder={t('phoneNumber')}
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
              placeholder={t('contactMessage')}
              isMultiline
              value={message}
              onChangeText={setMessage}
            />
          </View>
          <CustomButton
            text="send"
            isDisabled={isSubmitting}
            onPress={handleSubmit}
          />
        </WhiteCard>
      </View>
    </HomeScreen>
  );
};

export default ContactScreen;
