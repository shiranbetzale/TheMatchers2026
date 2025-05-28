import React, {useState} from 'react';
import {TextInput, View} from 'react-native';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomInput.style';
import {CustomInputType} from './CustomInput.type';

const CustomInput = (props: CustomInputType) => {
  const {
    isMaxWidth = false,
    defaultValue = '',
    placeholder,
    keyboardType,
    isMultiline = false,
    isEditable = true,
  } = props;
  const [text, onChangeText] = useState<string>('');
  const defaultValueStr = defaultValue?.toString();

  return (
    <View style={[styles.container, isMultiline && styles.textAreaContainer]}>
      <View style={!isMultiline && isMaxWidth && styles.maxWidth}>
        <CustomText text={placeholder} />
      </View>
      <TextInput
        style={[styles.input, isMultiline && styles.textArea]}
        onChangeText={onChangeText}
        value={!isEditable ? defaultValueStr : text}
        keyboardType={keyboardType}
        multiline={isMultiline}
        editable={isEditable}
      />
    </View>
  );
};

export default CustomInput;
