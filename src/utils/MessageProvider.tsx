import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Modal, StyleSheet, View} from 'react-native';

import CustomButton from '../components/CustomButton/CustomButton';
import CustomText from '../components/CustomText/CustomText';
import {FontsStyle} from './FontsStyle';
import {useLanguage} from './LanguageProvider';

type MessageType = 'success' | 'error' | 'info';

type MessageOptions = {
  type?: MessageType;
  title?: string;
  message: string;
  autoDismissMs?: number | false;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
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
    accent: '#1F8A5B',
    background: '#EAF7F0',
    icon: '✓',
  },
  error: {
    accent: '#C93A3A',
    background: '#FCEEEE',
    icon: '!',
  },
  info: {
    accent: '#2F68B8',
    background: '#EEF4FF',
    icon: 'i',
  },
};

export const MessageProvider = ({children}: {children: React.ReactNode}) => {
  const {isRTL} = useLanguage();
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
    type === 'success' ? 'success' : type === 'error' ? 'error' : '';
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

  return (
    <MessageContext.Provider value={contextValue}>
      {children}

      {messageOptions ? (
        <Modal
          transparent
          visible
          animationType="fade"
          onRequestClose={handleClose}>
          <View style={styles.overlay}>
            <View style={styles.card}>
              <View
                style={[styles.header, isRTL ? styles.rowReverse : styles.row]}>
                <View
                  style={[
                    styles.iconWrap,
                    {
                      backgroundColor: typeStyles.background,
                      borderColor: typeStyles.accent,
                    },
                  ]}>
                  <CustomText
                    text={typeStyles.icon}
                    customStyle={[styles.iconText, {color: typeStyles.accent}]}
                  />
                </View>

                <View style={styles.textArea}>
                  <CustomText
                    text={messageOptions.title || defaultTitle}
                    customStyle={[
                      styles.title,
                      isRTL ? styles.textRight : styles.textLeft,
                    ]}
                  />

                  <CustomText
                    text={messageOptions.message}
                    customStyle={[
                      styles.message,
                      isRTL ? styles.textRight : styles.textLeft,
                    ]}
                  />
                </View>
              </View>

              {hasConfirmAction ? (
                <View
                  style={[
                    styles.actionsRow,
                    isRTL ? styles.rowReverse : styles.row,
                  ]}>
                  <CustomButton
                    onPress={hideMessage}
                    text={messageOptions.cancelText || 'cancel'}
                    customStyle={[styles.actionButton, styles.cancelButton]}
                    customTextStyle={styles.cancelText}
                  />

                  <CustomButton
                    onPress={handleConfirm}
                    text={messageOptions.confirmText || 'yes'}
                    customStyle={[
                      styles.actionButton,
                      {backgroundColor: typeStyles.accent},
                    ]}
                    customTextStyle={styles.confirmText}
                  />
                </View>
              ) : (
                <CustomButton
                  onPress={handleClose}
                  text="close"
                  customStyle={[
                    styles.closeButton,
                    {backgroundColor: typeStyles.accent},
                  ]}
                  customTextStyle={styles.closeText}
                />
              )}
            </View>
          </View>
        </Modal>
      ) : null}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(17, 24, 39, 0.32)',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 8,
    padding: 18,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
  header: {
    alignItems: 'flex-start',
    gap: 12,
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    ...FontsStyle.textDecoration,
    fontSize: 20,
  },
  textArea: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...FontsStyle.textDecoration,
    color: '#172033',
    fontSize: 17,
    marginBottom: 6,
  },
  message: {
    ...FontsStyle.text,
    color: '#4F5B6D',
    fontSize: 14,
    lineHeight: 21,
  },
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
  closeButton: {
    minHeight: 42,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    paddingHorizontal: 16,
  },
  closeText: {
    ...FontsStyle.textDecoration,
    color: '#FFFFFF',
    fontSize: 15,
  },
  actionsRow: {
    gap: 10,
    marginTop: 18,
  },
  actionButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  cancelButton: {
    backgroundColor: '#EEF1F5',
  },
  cancelText: {
    ...FontsStyle.textDecoration,
    color: '#4F5B6D',
    fontSize: 15,
  },
  confirmText: {
    ...FontsStyle.textDecoration,
    color: '#FFFFFF',
    fontSize: 15,
  },
});
