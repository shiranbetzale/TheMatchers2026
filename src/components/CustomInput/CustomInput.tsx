import React, {useEffect, useMemo, useState} from 'react';
import {TextInput, View, TouchableOpacity, Text} from 'react-native';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomInput.style';
import {CustomInputType} from './CustomInput.type';
import {useLanguage} from '../../utils/LanguageProvider';

const formatDigitsWithCommas = (value: unknown) => {
  const digits = String(value || '').replace(/\D+/g, '');

  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const CustomInput = (props: CustomInputType) => {
  const {
    maxLength,
    autoCapitalize,
    isSmallSize = false,
    placeholder,
    keyboardType = 'default',
    inputMode,
    onlyDigits = false,
    formatWithCommas = false,
    secureTextEntry = false,
    allowToggleSecure = false,
    isMultiline = false,
    isEditable = true,
    errorText,
    defaultValue,
    value, // הערך מגיע מהורה
    onChangeText = () => {},
  } = props;
  const {isRTL, t} = useLanguage();
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const showToggle = allowToggleSecure && secureTextEntry;
  const toggleText = useMemo(
    () => (isRTL ? (isSecure ? '👁️' : '👁️‍🗨️') : isSecure ? '👁️' : '👁️‍🗨️'),
    [isSecure, isRTL],
  );
  useEffect(() => {
    setIsSecure(secureTextEntry);
  }, [secureTextEntry]);

  const displayValue = formatWithCommas
    ? formatDigitsWithCommas(value)
    : value?.toString() || '';
  const displayDefaultValue = formatWithCommas
    ? formatDigitsWithCommas(defaultValue)
    : defaultValue?.toString();

  const inputElement = (
    <TextInput
      placeholderTextColor="#A8ADB7"
      style={[
        isSmallSize ? styles.smallInput : styles.input,
        isMultiline && styles.textArea,
        styles.baseInput,
        !isEditable && styles.readOnlyInput,
        errorText && styles.errorInput,
        isRTL ? styles.rtlInput : styles.ltrInput,
      ]}
      onChangeText={text => {
        const next =
          onlyDigits || formatWithCommas ? text.replace(/\D+/g, '') : text;
        onChangeText(next);
      }}
      autoCapitalize={autoCapitalize}
      defaultValue={displayDefaultValue}
      value={displayValue}
      keyboardType={keyboardType}
      inputMode={inputMode}
      secureTextEntry={isSecure}
      multiline={isMultiline}
      editable={isEditable}
      maxLength={maxLength}
      placeholder={t(String(placeholder))}
      textAlign={isRTL ? 'right' : 'left'}
    />
  );

  const errorElement = errorText ? (
    <CustomText
      text={errorText}
      customStyle={[
        styles.errorText,
        isRTL ? styles.textRight : styles.textLeft,
      ]}
    />
  ) : null;

  if (isMultiline) {
    return (
      <View
        style={[
          styles.fieldContainer,
          styles.textAreaContainer,
          isRTL ? styles.textAreaContainerRtl : styles.textAreaContainerLtr,
        ]}>
        <CustomText
          text={placeholder}
          customStyle={[
            styles.label,
            isRTL ? styles.textRight : styles.textLeft,
          ]}
        />
        {inputElement}
        {errorElement}
      </View>
    );
  }

  return (
    <View style={styles.fieldContainer}>
      <View
        style={[
          isSmallSize ? styles.smallContainer : styles.container,
          isRTL ? styles.rowReverse : styles.row,
        ]}>
        <View style={!isMultiline ? styles.labelWrapper : undefined}>
          <CustomText
            text={placeholder}
            customStyle={[
              styles.label,
              isRTL ? styles.textRight : styles.textLeft,
            ]}
          />
        </View>
        <View style={styles.inputWrapper}>
          {inputElement}
          {showToggle && (
            <TouchableOpacity
              onPress={() => setIsSecure(prev => !prev)}
              style={[styles.toggleSecure, isRTL && styles.toggleSecureRtl]}>
              <Text style={styles.toggleSecureText}>{toggleText}</Text>
            </TouchableOpacity>
          )}
          {errorElement}
        </View>
      </View>
    </View>
  );
};

export default CustomInput;
