import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './ErrorBanner.style';

type ErrorBannerProps = {
  message: string;
  icon?: string;
  variant?: 'error' | 'warning' | 'info';
};

const VARIANT_ICON: Record<NonNullable<ErrorBannerProps['variant']>, string> = {
  error: '⚠️',
  warning: '⚠️',
  info: 'ℹ️',
};

const ErrorBanner = ({ message, icon, variant = 'error' }: ErrorBannerProps) => {
  const resolvedIcon = icon || VARIANT_ICON[variant];

  return (
    <View style={[styles.container, styles[variant]]}>
      <Text style={styles.icon}>{resolvedIcon}</Text>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default ErrorBanner;
