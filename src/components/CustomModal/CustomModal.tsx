import React, {ReactNode} from 'react';
import {
  Modal,
  ModalProps,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import CustomButton from '../CustomButton/CustomButton';
import CustomText from '../CustomText/CustomText';
import SharedStyles from '../../utils/SharedStyles';
import {useLanguage} from '../../utils/LanguageProvider';
import CloseIcon from '../CloseIcon/CloseIcon';

type CustomModalProps = Omit<ModalProps, 'children'> & {
  children: ReactNode;
  closeButtonStyle?: StyleProp<ViewStyle>;
  closeOnBackdropPress?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  onClose?: () => void;
  overlayStyle?: StyleProp<ViewStyle>;
  showCloseButton?: boolean;
  subtitle?: string;
  subtitleStyle?: StyleProp<TextStyle>;
  title?: string;
  titleContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

const CustomModal = (props: CustomModalProps) => {
  const {isRTL, t} = useLanguage();
  const {
    animationType = 'fade',
    children,
    closeButtonStyle,
    closeOnBackdropPress = false,
    contentStyle,
    headerStyle,
    onClose,
    onRequestClose,
    overlayStyle,
    showCloseButton = false,
    statusBarTranslucent = true,
    subtitle,
    subtitleStyle,
    title,
    titleContainerStyle,
    titleStyle,
    transparent = true,
    ...modalProps
  } = props;
  const usesShell = Boolean(
    contentStyle || overlayStyle || title || showCloseButton,
  );

  const content = usesShell ? (
    <CustomButton
      unstyled
      activeOpacity={1}
      style={[SharedStyles.modalOverlay, overlayStyle]}
      onPress={closeOnBackdropPress ? onClose : undefined}>
      <CustomButton
        unstyled
        activeOpacity={1}
        accessibilityLabel={title ? t(title) : undefined}
        accessibilityViewIsModal
        onAccessibilityEscape={onClose}
        style={contentStyle}
        onPress={event => event.stopPropagation()}>
        {title || subtitle || showCloseButton ? (
          <View
            style={[
              SharedStyles.modalHeader,
              isRTL ? SharedStyles.rowReverse : SharedStyles.row,
              headerStyle,
            ]}>
            <View style={[SharedStyles.flex, titleContainerStyle]}>
              {title ? (
                <CustomText
                  accessibilityRole="header"
                  text={title}
                  customStyle={titleStyle}
                />
              ) : null}
              {subtitle ? (
                <CustomText text={subtitle} customStyle={subtitleStyle} />
              ) : null}
            </View>
            {showCloseButton ? (
              <CustomButton
                unstyled
                accessibilityLabel="close"
                customStyle={[SharedStyles.modalCloseButton, closeButtonStyle]}
                icon={<CloseIcon />}
                onPress={onClose ?? (() => {})}
              />
            ) : null}
          </View>
        ) : null}
        {children}
      </CustomButton>
    </CustomButton>
  ) : (
    children
  );

  return (
    <Modal
      {...modalProps}
      animationType={animationType}
      onRequestClose={onRequestClose ?? onClose}
      statusBarTranslucent={statusBarTranslucent}
      transparent={transparent}>
      {content}
    </Modal>
  );
};

export default CustomModal;
