import React from 'react';
import {Text, View} from 'react-native';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomText from '../../components/CustomText/CustomText';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import {useLanguage} from '../../utils/LanguageProvider';
import {styles} from './ContactRequestsScreen.style';

export type ContactRequestStatus = 'new' | 'read' | 'handled';

export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: ContactRequestStatus;
  emailSent?: boolean;
  emailError?: string;
  createdAt?: string;
  readAt?: string;
  handledAt?: string;
};

type ContactRequestCardProps = {
  isUpdating: boolean;
  request: ContactRequest;
  onUpdate: (request: ContactRequest) => void;
};

const getStatusKey = (status: ContactRequestStatus) => {
  if (status === 'handled') return 'contactRequestHandled';
  if (status === 'read') return 'contactRequestRead';
  return 'contactRequestNew';
};

const formatDateTime = (value?: string) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ContactRequestCard = ({
  isUpdating,
  onUpdate,
  request,
}: ContactRequestCardProps) => {
  const {t, isRTL} = useLanguage();
  const isHandled = request.status === 'handled';
  const createdAtText = formatDateTime(request.createdAt);

  return (
    <WhiteCard customStyle={styles.card}>
      <View style={[styles.cardHeader, isRTL ? styles.rowReverse : styles.row]}>
        <View style={styles.titleBlock}>
          <Text
            accessibilityRole="header"
            style={[
              styles.requestName,
              isRTL ? styles.textRight : styles.textLeft,
            ]}>
            {request.name || t('unknown')}
          </Text>
          {[request.email, request.phone, createdAtText]
            .filter(Boolean)
            .map((value, index) => (
              <Text
                key={`${index}_${value}`}
                style={[
                  styles.requestMeta,
                  isRTL ? styles.textRight : styles.textLeft,
                ]}>
                {value}
              </Text>
            ))}
        </View>

        <View
          style={[
            styles.statusBadge,
            request.status === 'new' && styles.statusBadgeNew,
            isHandled && styles.statusBadgeHandled,
          ]}>
          <CustomText
            text={getStatusKey(request.status)}
            customStyle={styles.statusText}
          />
        </View>
      </View>

      <Text
        style={[
          styles.messageText,
          isRTL ? styles.textRight : styles.textLeft,
        ]}>
        {request.message}
      </Text>

      {!request.emailSent && request.emailError ? (
        <CustomText
          text={`${t('contactRequestEmailFailed')}: ${request.emailError}`}
          customStyle={styles.emailError}
        />
      ) : null}

      <View style={[styles.actions, isRTL ? styles.rowReverse : styles.row]}>
        <CustomButton
          text="markAsReadAndHandled"
          isDisabled={isHandled || isUpdating}
          customStyle={[styles.actionButton, styles.handledButton]}
          onPress={() => onUpdate(request)}
        />
      </View>
    </WhiteCard>
  );
};

export default ContactRequestCard;
