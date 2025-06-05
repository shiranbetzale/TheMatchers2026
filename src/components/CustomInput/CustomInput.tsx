import React, {useState} from 'react';
import {TextInput, View} from 'react-native';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomInput.style';
import {CustomInputType} from './CustomInput.type';

const CustomInput = (props: CustomInputType) => {
  const {
    maxLength,
    isSmallSize = false,
    defaultValue = '',
    placeholder,
    keyboardType = 'default',
    isMultiline = false,
    isEditable = true,
    onChangeText = () => {}, // מההורה
  } = props;

  const [text, setText] = useState<string>('');
  const defaultValueStr = defaultValue?.toString();

  const handleChangeText = (input: string) => {
    setText(input); // עדכון מקומי
    onChangeText(input); // עדכון להורה
  };

  return (
    <View
      style={[
        isSmallSize ? styles.smallContainer : styles.container,
        isMultiline && styles.textAreaContainer,
      ]}>
      <View style={!isMultiline && styles.maxWidth}>
        <CustomText text={placeholder} />
      </View>
      <TextInput
        style={[
          isSmallSize ? styles.smallInput : styles.input,
          isMultiline && styles.textArea,
          styles.baseInput,
        ]}
        onChangeText={handleChangeText}
        value={!isEditable ? defaultValueStr : text}
        keyboardType={keyboardType}
        multiline={isMultiline}
        editable={isEditable}
        maxLength={maxLength}
      />
    </View>
  );
};

export default CustomInput;
