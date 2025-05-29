import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import CustomText from '../CustomText/CustomText';
import { styles } from './CustomInput.style';
import { CustomInputType } from './CustomInput.type';

const CustomInput = (props: CustomInputType) => {
  const { maxLength, isSmallSize = false, defaultValue = '', placeholder, keyboardType, isMultiline = false, isEditable = true } = props;
  const [text, onChangeText] = useState<string>('');
  const defaultValueStr = defaultValue?.toString();

  return (
    <View style={[isSmallSize ? styles.smallContainer : styles.container, isMultiline && styles.textAreaContainer]}>
      <View style={!isMultiline && styles.maxWidth}>
        <CustomText text={placeholder} />
      </View>
      <TextInput
        style={[isSmallSize ? styles.smallInput : styles.input, isMultiline && styles.textArea, styles.baseInput]}
        onChangeText={onChangeText}
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
