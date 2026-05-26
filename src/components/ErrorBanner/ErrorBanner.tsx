import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './ErrorBanner.style';
import {useLanguage} from '../../utils/LanguageProvider';

type ErrorBannerProps = {
  message: string;
  icon?: string;
  variant?: 'error' | 'warning' | 'info';
};

const VARIANT_ICON: Record<NonNullable<ErrorBannerProps['variant']>, string> = {
  error: '!',
  warning: '!',
  info: 'i',
};

const ErrorBanner = ({ message, icon, variant = 'error' }: ErrorBannerProps) => {
  const {isRTL, t} = useLanguage();
  const resolvedIcon = icon || VARIANT_ICON[variant];
  const translatedMessage = t(message);

  return (
    <View
      style={[
        styles.container,
        styles[variant],
        isRTL ? styles.rowReverse : styles.row,
      ]}>
      <View style={styles.iconBadge}>
        <Text style={styles.icon}>{resolvedIcon}</Text>
      </View>
      <Text style={[styles.text, isRTL ? styles.rtlText : styles.ltrText]}>
        {translatedMessage}
      </Text>
    </View>
  );
};

export default ErrorBanner;
