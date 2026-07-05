import React, {useEffect, useState} from 'react';
import CustomButton from '../CustomButton/CustomButton';
import {Text, View} from 'react-native';
import {styles} from './CustomCheckBox.style';
import CustomText from '../CustomText/CustomText';
import {Option} from '../../utils/FormFields.type';

type SingleCheckBoxProps = Option & {
  isRTL?: boolean;
  isEditable?: boolean;
  isSelected?: boolean;
  onChange?: (option: Option, value: boolean) => void;
};

const CustomSingleCheckBox = (props: SingleCheckBoxProps) => {
  const {
    id,
    isEditable = true,
    isSelected: initialIsSelected = false,
    isRTL = false,
    label,
    isSmallSize = false,
    onChange,
  } = props;
  const [isSelected, setSelection] = useState(initialIsSelected);

  useEffect(() => {
    setSelection(initialIsSelected);
  }, [initialIsSelected]);

  const handleToggle = (next: boolean) => {
    if (!isEditable) {
      return;
    }

    setSelection(next);
    onChange?.(props, next);
  };

  return (
    <React.Fragment>
      <CustomButton
        unstyled
        accessibilityLabel={label}
        accessibilityRole="checkbox"
        accessibilityState={{checked: isSelected, disabled: !isEditable}}
        activeOpacity={0.85}
        disabled={!isEditable}
        onPress={() => handleToggle(!isSelected)}
        style={[
          isSmallSize ? styles.smallCheckbox : styles.checkbox,
          styles.checkboxBox,
          isSelected && styles.checkboxBoxSelected,
          !isEditable && styles.disabledCheckbox,
        ]}>
        {isSelected && (
          <View style={styles.checkMarkContainer}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        )}
      </CustomButton>
      <CustomText
        text={label}
        customStyle={[
          styles.optionText,
          isRTL ? styles.textRight : styles.textLeft,
        ]}
      />
    </React.Fragment>
  );
};

export default CustomSingleCheckBox;
