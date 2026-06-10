import React, {useEffect, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {CustomRadioButtonType} from './CustomRadioButton.type';
import {styles} from './CustomRadioButton.style';
import CustomText from '../CustomText/CustomText';
import {Option} from '../../utils/FormFields.type';
import {FontsStyle} from '../../utils/FontsStyle';
import {useLanguage} from '../../utils/LanguageProvider';

const CustomRadioButton = (props: CustomRadioButtonType) => {
  const {
    isEditable = true,
    isSmallSize = false,
    radiosArray,
    text,
    onSelect = () => {},
    value,
  } = props;
  const {isRTL} = useLanguage();
  const selectedValueOption = useMemo(
    () =>
      radiosArray.find(
        option =>
          option.name === value ||
          option.label === value ||
          option.originalLabel === value ||
          option.value === value ||
          option.genderLabels?.male === value ||
          option.genderLabels?.female === value ||
          String(option.id) === String(value),
      ),
    [radiosArray, value],
  );
  const [selectedOption, setSelectedOption] = useState<Option>(
    selectedValueOption ?? radiosArray[0],
  );

  useEffect(() => {
    setSelectedOption(selectedValueOption ?? radiosArray[0]);
  }, [radiosArray, selectedValueOption]);

  const handleOptionSelect = (option: Option) => {
    if (!isEditable) {
      return;
    }

    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <View pointerEvents={isEditable ? 'auto' : 'none'}>
      <CustomText
        text={text}
        customStyle={[
          FontsStyle.questionLabel,
          isRTL ? styles.textRight : styles.textLeft,
        ]}
      />
      <>
        {radiosArray.map(radioItem => {
          return (
            <TouchableOpacity
              key={`${radioItem.name}_${radioItem.id}`}
              style={isSmallSize ? styles.smallBtn : styles.btn}
              disabled={!isEditable}
              onPress={() => handleOptionSelect(radioItem)}>
              <View style={styles.optionsContainer}>
                <View
                  style={[
                    isSmallSize ? styles.smallCircle : styles.circle,
                    styles.baseCircle,
                    selectedOption?.id === radioItem.id &&
                      styles.selectedCircle,
                  ]}
                />
                <CustomText
                  text={radioItem.label}
                  customStyle={FontsStyle.text}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </>
    </View>
  );
};

export default CustomRadioButton;
