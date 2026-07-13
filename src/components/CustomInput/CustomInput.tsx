import React, {useEffect, useMemo, useState} from 'react';
import CustomButton from '../CustomButton/CustomButton';
import {TextInput, View, Text} from 'react-native';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomInput.style';
import {CustomInputType} from './CustomInput.type';
import {useLanguage} from '../../utils/LanguageProvider';
import Colors from '../../utils/Colors';

const formatDigitsWithCommas = (value: unknown) => {
  const digits = String(value || '').replace(/\D+/g, '');

  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const CustomInput = (props: CustomInputType) => {
  const {
    testID,
    accessibilityHint,
    accessibilityLabel,
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
    text,
    defaultValue,
    value,
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
  const labelText = text || placeholder;
  const resolvedTestID = testID || `input-${String(placeholder)}`;

  const inputElement = (
    <TextInput
      testID={resolvedTestID}
      accessible
      accessibilityHint={accessibilityHint ? t(accessibilityHint) : undefined}
      accessibilityLabel={t(accessibilityLabel || String(labelText))}
      accessibilityState={{disabled: !isEditable}}
      accessibilityValue={errorText ? {text: t(errorText)} : undefined}
      placeholderTextColor={Colors.placeholder}
      style={[
        isSmallSize ? styles.smallInput : styles.input,
        isMultiline && styles.textArea,
        styles.baseInput,
        !isEditable && styles.readOnlyInput,
        errorText && styles.errorInput,
        isRTL ? styles.rtlInput : styles.ltrInput,
      ]}
      onChangeText={inputText => {
        const next =
          onlyDigits || formatWithCommas
            ? inputText.replace(/\D+/g, '')
            : inputText;
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
          text={labelText}
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
            text={labelText}
            customStyle={[
              styles.label,
              isRTL ? styles.textRight : styles.textLeft,
            ]}
          />
        </View>
        <View style={styles.inputWrapper}>
          {inputElement}
          {showToggle && (
            <CustomButton
              unstyled
              testID={`${resolvedTestID}-toggle-secure`}
              accessibilityLabel={isSecure ? 'showPassword' : 'hidePassword'}
              onPress={() => setIsSecure(prev => !prev)}
              style={[styles.toggleSecure, isRTL && styles.toggleSecureRtl]}>
              <Text style={styles.toggleSecureText}>{toggleText}</Text>
            </CustomButton>
          )}
          {errorElement}
        </View>
      </View>
    </View>
  );
};

export default CustomInput;
