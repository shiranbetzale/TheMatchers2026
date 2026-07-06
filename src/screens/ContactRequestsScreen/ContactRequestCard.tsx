import React from 'react';
import {Linking, Text, View} from 'react-native';
import EmailSvg from '../../assets/images/email.svg';
import PhoneSvg from '../../assets/images/phone.svg';
import WhatsappSvg from '../../assets/images/whatsapp.svg';
import CustomButton, {
  BUTTON_ICON_SIZE,
} from '../../components/CustomButton/CustomButton';
import CustomText from '../../components/CustomText/CustomText';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import {useLanguage} from '../../utils/LanguageProvider';
import {styles} from './ContactRequestsScreen.style';

export type ContactRequestStatus = 'new' | 'read' | 'handled';
export type ContactRequestType = 'general' | 'account_deletion';

export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  requestType?: ContactRequestType;
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

const getRequestTypeKey = (requestType?: ContactRequestType) =>
  requestType === 'account_deletion'
    ? 'accountDeletionRequestType'
    : 'generalContactRequestType';

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

const getPhoneDigits = (value?: string) =>
  String(value || '').replace(/\D/g, '');

const getWhatsAppPhone = (value?: string) => {
  const phone = getPhoneDigits(value);
  if (phone.startsWith('972')) return phone;
  if (phone.startsWith('0')) return `972${phone.slice(1)}`;
  return phone;
};

const ContactRequestCard = ({
  isUpdating,
  onUpdate,
  request,
}: ContactRequestCardProps) => {
  const {t, isRTL} = useLanguage();
  const isHandled = request.status === 'handled';
  const createdAtText = formatDateTime(request.createdAt);
  const phone = getPhoneDigits(request.phone);
  const whatsappPhone = getWhatsAppPhone(request.phone);

  const openContactUrl = (url: string) => {
    Linking.openURL(url).catch(() => undefined);
  };

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

        <View style={styles.badgesColumn}>
          <View
            style={[
              styles.statusBadge,
              request.requestType === 'account_deletion' && styles.statusBadgeNew,
            ]}>
            <CustomText
              text={getRequestTypeKey(request.requestType)}
              customStyle={styles.statusText}
            />
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

      <View
        style={[
          styles.contactActions,
          isRTL ? styles.rowReverse : styles.row,
        ]}>
        {phone ? (
          <CustomButton
            unstyled
            accessibilityLabel={t('call')}
            customStyle={styles.contactAction}
            onPress={() => openContactUrl(`tel:${phone}`)}>
            <PhoneSvg width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
          </CustomButton>
        ) : null}

        {whatsappPhone ? (
          <CustomButton
            unstyled
            accessibilityLabel={t('whatsapp')}
            customStyle={styles.contactAction}
            onPress={() =>
              openContactUrl(`whatsapp://send?phone=${whatsappPhone}`)
            }>
            <WhatsappSvg width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
          </CustomButton>
        ) : null}

        {request.email ? (
          <CustomButton
            unstyled
            accessibilityLabel={t('email')}
            customStyle={styles.contactAction}
            onPress={() => openContactUrl(`mailto:${request.email.trim()}`)}>
            <EmailSvg width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
          </CustomButton>
        ) : null}
      </View>

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
