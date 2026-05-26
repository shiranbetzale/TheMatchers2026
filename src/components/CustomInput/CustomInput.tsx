import React, {useMemo, useState} from 'react';
import {TextInput, View, TouchableOpacity, Text} from 'react-native';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomInput.style';
import {CustomInputType} from './CustomInput.type';
import {useLanguage} from '../../utils/LanguageProvider';

const CustomInput = (props: CustomInputType) => {
  const {
    maxLength,
    isSmallSize = false,
    placeholder,
    keyboardType = 'default',
    inputMode,
    onlyDigits = false,
    secureTextEntry = false,
    allowToggleSecure = false,
    isMultiline = false,
    isEditable = true,
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

  return (
    <View
      style={[
        isSmallSize ? styles.smallContainer : styles.container,
        !isMultiline && (isRTL ? styles.rowReverse : styles.row),
        isMultiline && [
          styles.textAreaContainer,
          isRTL ? styles.textAreaContainerRtl : styles.textAreaContainerLtr,
        ],
      ]}>
      <View style={!isMultiline && styles.maxWidth}>
        <CustomText text={placeholder} />
      </View>
      <TextInput
        style={[
          isSmallSize ? styles.smallInput : styles.input,
          isMultiline && styles.textArea,
          styles.baseInput,
          !isEditable && styles.readOnlyInput,
          isRTL ? styles.rtlInput : styles.ltrInput,
        ]}
        onChangeText={text => {
          const next = onlyDigits ? text.replace(/\D+/g, '') : text;
          onChangeText(next);
        }}
        value={value?.toString() || ''}
        keyboardType={keyboardType}
        inputMode={inputMode}
        secureTextEntry={isSecure}
        multiline={isMultiline}
        editable={isEditable}
        maxLength={maxLength}
        placeholder={t(String(placeholder))}
        textAlign={isRTL ? 'right' : 'left'}
      />
      {showToggle && (
        <TouchableOpacity
          onPress={() => setIsSecure(prev => !prev)}
          style={[styles.toggleSecure, isRTL && styles.toggleSecureRtl]}>
          <Text style={styles.toggleSecureText}>{toggleText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomInput;
