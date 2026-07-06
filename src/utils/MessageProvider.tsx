import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {StyleSheet, View} from 'react-native';

import CustomButton from '../components/CustomButton/CustomButton';
import CustomText from '../components/CustomText/CustomText';
import {FontSize, FontsStyle} from './FontsStyle';
import {useLanguage} from './LanguageProvider';
import SharedStyles from './SharedStyles';
import Colors from './Colors';
import GeneralStyle from './GeneralStyle';
import CustomModal from '../components/CustomModal/CustomModal';
import CloseIcon from '../components/CloseIcon/CloseIcon';
import MoreInfoIcon from '../assets/images/moreInfo.svg';
import {
  clearErrorMessageHandler,
  setErrorMessageHandler,
} from './MessageManager';

type MessageType = 'success' | 'error' | 'info';

type MessageOptions = {
  type?: MessageType;
  title?: string;
  message: string;
  autoDismissMs?: number | false;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onClose?: () => void | Promise<void>;
};

type MessageContextType = {
  showMessage: (options: MessageOptions) => void;
  hideMessage: () => void;
};

const MessageContext = createContext<MessageContextType>({
  showMessage: () => {},
  hideMessage: () => {},
});

const TYPE_STYLES: Record<
  MessageType,
  {accent: string; background: string; icon: string}
> = {
  success: {
    accent: Colors.success,
    background: Colors.successSoft,
    icon: '✓',
  },
  error: {
    accent: Colors.danger,
    background: Colors.dangerSoft,
    icon: '!',
  },
  info: {
    accent: Colors.info,
    background: Colors.softBlue,
    icon: 'i',
  },
};

export const MessageProvider = ({children}: {children: React.ReactNode}) => {
  const {isRTL, t} = useLanguage();
  const [messageOptions, setMessageOptions] = useState<MessageOptions | null>(
    null,
  );

  const hideMessage = useCallback(() => {
    setMessageOptions(null);
  }, []);

  const showMessage = useCallback((options: MessageOptions) => {
    setMessageOptions({
      type: 'info',
      autoDismissMs: options.type === 'success' ? 2400 : false,
      ...options,
    });
  }, []);

  useEffect(() => {
    setErrorMessageHandler(messageKey => {
      showMessage({type: 'error', message: t(messageKey)});
    });

    return clearErrorMessageHandler;
  }, [showMessage, t]);

  useEffect(() => {
    if (!messageOptions?.autoDismissMs) {
      return;
    }

    const timer = setTimeout(hideMessage, messageOptions.autoDismissMs);

    return () => clearTimeout(timer);
  }, [hideMessage, messageOptions]);

  const contextValue = useMemo(
    () => ({
      showMessage,
      hideMessage,
    }),
    [hideMessage, showMessage],
  );

  const type = messageOptions?.type ?? 'info';
  const typeStyles = TYPE_STYLES[type];
  const defaultTitle =
    type === 'success' ? 'success' : type === 'error' ? 'error' : 'notice';
  const hasConfirmAction = Boolean(messageOptions?.onConfirm);

  const handleConfirm = async () => {
    const onConfirm = messageOptions?.onConfirm;

    hideMessage();
    await onConfirm?.();
  };

  const handleClose = async () => {
    const onClose = messageOptions?.onClose;

    hideMessage();
    await onClose?.();
  };

  const handleCancel = async () => {
    const onCancel = messageOptions?.onCancel;

    hideMessage();
    await onCancel?.();
  };

  return (
    <MessageContext.Provider value={contextValue}>
      {children}

      {messageOptions ? (
        <CustomModal
          transparent
          visible
          animationType="none"
          onRequestClose={handleClose}>
          <View style={styles.overlay}>
            <View
              accessible
              accessibilityLiveRegion="assertive"
              accessibilityRole="alert"
              style={[styles.card, {borderColor: typeStyles.accent}]}>
              <CustomButton
                unstyled
                accessibilityLabel={t('close')}
                style={[
                  styles.headerCloseButton,
                  isRTL ? styles.closeButtonRtl : styles.closeButtonLtr,
                ]}
                icon={<CloseIcon />}
                onPress={handleClose}
              />

              <View style={styles.body}>
                <View
                  style={[
                    styles.iconWrap,
                    {
                      backgroundColor: typeStyles.background,
                      borderColor: typeStyles.accent,
                    },
                    type === 'info' && styles.infoIconWrap,
                  ]}>
                  {type === 'info' ? (
                    <MoreInfoIcon
                      width={GeneralStyle.size.badge}
                      height={GeneralStyle.size.badge}
                      fill={typeStyles.accent}
                    />
                  ) : (
                    <CustomText
                      text={typeStyles.icon}
                      customStyle={[
                        styles.iconText,
                        {color: typeStyles.accent},
                      ]}
                    />
                  )}
                </View>

                <CustomText
                  text={messageOptions.title || defaultTitle}
                  customStyle={styles.title}
                />

                <CustomText
                  text={messageOptions.message}
                  customStyle={styles.message}
                />
              </View>

              {hasConfirmAction ? (
                <View
                  style={[
                    styles.actionsRow,
                    isRTL ? styles.rowReverse : styles.row,
                  ]}>
                  <CustomButton
                    variant="secondary"
                    onPress={handleCancel}
                    text={messageOptions.cancelText || 'cancel'}
                    customStyle={[styles.actionButton, styles.cancelButton]}
                    customTextStyle={styles.cancelText}
                  />

                  <CustomButton
                    variant={type === 'error' ? 'danger' : 'primary'}
                    onPress={handleConfirm}
                    text={messageOptions.confirmText || 'confirm'}
                    customStyle={[
                      styles.actionButton,
                      {backgroundColor: typeStyles.accent},
                    ]}
                    customTextStyle={styles.confirmText}
                  />
                </View>
              ) : null}
            </View>
          </View>
        </CustomModal>
      ) : null}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);

const styles = StyleSheet.create({
  ...SharedStyles,
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.overlay,
  },
  card: {
    width: '100%',
    maxWidth: GeneralStyle.size.modal,
    overflow: 'hidden',
    borderWidth: 2,
    borderRadius: GeneralStyle.radius.md,
    padding: GeneralStyle.spacing.lg,
    paddingTop: GeneralStyle.spacing.xl,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
  headerCloseButton: {
    position: 'absolute',
    top: GeneralStyle.spacing.sm,
    width: GeneralStyle.size.icon,
    height: GeneralStyle.size.icon,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GeneralStyle.radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.white,
    zIndex: 2,
  },
  closeButtonRtl: {
    left: GeneralStyle.spacing.sm,
  },
  closeButtonLtr: {
    right: GeneralStyle.spacing.sm,
  },
  body: {
    alignItems: 'center',
    gap: GeneralStyle.spacing.sm,
    paddingTop: GeneralStyle.spacing.md,
  },
  iconWrap: {
    width: GeneralStyle.size.badge,
    height: GeneralStyle.size.badge,
    borderRadius: GeneralStyle.size.badge / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    ...FontsStyle.textDecoration,
    fontSize: FontSize.iconLarge,
    lineHeight: 40,
    textAlign: 'center',
  },
  infoIconWrap: {
    borderWidth: 0,
    backgroundColor: Colors.transparent,
  },
  title: {
    ...FontsStyle.textDecoration,
    width: '100%',
    color: Colors.darkGreen,
    fontSize: FontSize.heading,
    lineHeight: 28,
    textAlign: 'center',
  },
  message: {
    ...FontsStyle.text,
    width: '100%',
    color: Colors.slate,
    fontSize: FontSize.body,
    lineHeight: 24,
    textAlign: 'center',
  },
  actionsRow: {
    gap: 10,
    marginTop: 18,
  },
  actionButton: {
    flex: 1,
    minHeight: GeneralStyle.size.control,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  cancelButton: {
    backgroundColor: Colors.surfaceMuted,
  },
  cancelText: {
    ...FontsStyle.textDecoration,
    color: Colors.slate,
    fontSize: FontSize.small,
  },
  confirmText: {
    ...FontsStyle.textDecoration,
    color: Colors.white,
    fontSize: FontSize.small,
  },
});
