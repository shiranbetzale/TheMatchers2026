import React from 'react';
import {Text, View} from 'react-native';

import CloseIcon from '../../components/CloseIcon/CloseIcon';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomModal from '../../components/CustomModal/CustomModal';
import CustomText from '../../components/CustomText/CustomText';
import {useLanguage} from '../../utils/LanguageProvider';
import {styles} from './Login.style';

type LoginModalsProps = {
  languageVisible: boolean;
  codeVisible: boolean;
  code: string;
  isFallbackCode: boolean;
  isVoiceCode: boolean;
  resendCooldown: number;
  isSubmitting: boolean;
  onCloseLanguage: () => void;
  onCloseCode: () => void;
  onChangeCode: (value: string) => void;
  onResendCode: () => void;
  onVoiceCode: () => void;
  onVerifyCode: () => void;
};

const LANGUAGES = [
  {code: 'he', label: 'עברית'},
  {code: 'en', label: 'English'},
];

const LoginModals = ({
  languageVisible,
  codeVisible,
  code,
  isFallbackCode,
  isVoiceCode,
  resendCooldown,
  isSubmitting,
  onCloseLanguage,
  onCloseCode,
  onChangeCode,
  onResendCode,
  onVoiceCode,
  onVerifyCode,
}: LoginModalsProps) => {
  const {t, language, changeLanguage, isRTL} = useLanguage();

  return (
    <>
      <CustomModal
        transparent
        visible={languageVisible}
        animationType="slide"
        onRequestClose={onCloseLanguage}>
        <CustomButton
          unstyled
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={onCloseLanguage}>
          <View style={styles.modalContent}>
            <View style={styles.codeModalHeader}>
              <CustomText
                text="selectLanguage"
                customStyle={styles.modalTitle}
              />
              <CustomButton
                unstyled
                accessibilityLabel={t('close')}
                style={styles.codeModalCloseButton}
                onPress={onCloseLanguage}>
                <CloseIcon />
              </CustomButton>
            </View>
            <View style={styles.languageOptions}>
              {LANGUAGES.map(item => {
                const isSelected = language === item.code;

                return (
                  <CustomButton
                    unstyled
                    key={item.code}
                    accessibilityRole="radio"
                    accessibilityState={{selected: isSelected}}
                    style={[
                      styles.modalOption,
                      isSelected && styles.modalOptionSelected,
                    ]}
                    onPress={async () => {
                      await changeLanguage(item.code);
                      onCloseLanguage();
                    }}>
                    <Text
                      style={[
                        styles.modalOptionText,
                        isSelected && styles.modalOptionTextSelected,
                      ]}>
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.languageCode,
                        isSelected && styles.modalOptionTextSelected,
                      ]}>
                      {item.code.toUpperCase()}
                    </Text>
                  </CustomButton>
                );
              })}
            </View>
          </View>
        </CustomButton>
      </CustomModal>

      <CustomModal
        transparent
        visible={codeVisible}
        animationType="fade"
        onRequestClose={onCloseCode}>
        <View style={styles.codeModalOverlay}>
          <View style={styles.codeModalContent}>
            <View style={styles.codeModalHeader}>
              <CustomText
                text="candidateCodeTitle"
                customStyle={styles.codeModalTitle}
              />
              <CustomButton
                variant="icon"
                accessibilityLabel={t('close')}
                style={styles.codeModalCloseButton}
                onPress={onCloseCode}>
                <CloseIcon />
              </CustomButton>
            </View>

            <CustomText
              text={
                isVoiceCode
                  ? 'candidateVoiceCodeSubtitle'
                  : isFallbackCode
                    ? 'candidateFallbackCodeSubtitle'
                    : 'candidateCodeSubtitle'
              }
              customStyle={[
                styles.codeModalSubtitle,
                isRTL ? styles.textRight : styles.textLeft,
              ]}
            />

            <View style={styles.space}>
              <CustomInput
                placeholder="candidateCodePlaceholder"
                keyboardType="number-pad"
                inputMode="numeric"
                onlyDigits
                maxLength={10}
                value={code}
                onChangeText={onChangeCode}
              />
            </View>

            {!isVoiceCode && !isFallbackCode && (
              <View style={styles.verificationAlternatives}>
                <CustomButton
                  variant="ghost"
                  text={
                    resendCooldown > 0
                      ? `${t('resendSms')} (${resendCooldown})`
                      : t('resendSms')
                  }
                  onPress={onResendCode}
                  isDisabled={isSubmitting || resendCooldown > 0}
                  customStyle={styles.resendButton}
                  customTextStyle={styles.resendButtonText}
                />
                <CustomButton
                  variant="secondary"
                  text="candidateVoiceCall"
                  onPress={onVoiceCode}
                  isDisabled={isSubmitting}
                  customStyle={styles.modalVoiceButton}
                  customTextStyle={styles.modalVoiceButtonText}
                />
              </View>
            )}

            <View
              style={[
                styles.codeModalActions,
                isRTL ? styles.rowReverse : styles.row,
              ]}>
              <CustomButton
                variant="secondary"
                text="cancel"
                onPress={onCloseCode}
                isDisabled={isSubmitting}
                customStyle={styles.codeCancelButton}
                customTextStyle={styles.codeCancelButtonText}
              />
              <CustomButton
                text={isSubmitting ? 'loading' : 'confirm'}
                onPress={onVerifyCode}
                isDisabled={isSubmitting}
                customStyle={styles.codeConfirmButton}
                customTextStyle={styles.codeConfirmButtonText}
              />
            </View>
          </View>
        </View>
      </CustomModal>
    </>
  );
};

export default LoginModals;
