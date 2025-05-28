import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {CustomRadioButtonType} from './CustomRadioButton.type';
import {styles} from './CustomRadioButton.style';
import CustomText from '../CustomText/CustomText';
import {Option} from '../../utils/FormFields.type';
import {FontsStyle} from '../../utils/FontsStyle';

const CustomRadioButton = (props: CustomRadioButtonType) => {
  const {radiosArray, text, onSelect = () => {}} = props;
  const [selectedOption, setSelectedOption] = useState<Option>(radiosArray[1]);

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <>
      <CustomText text={text} />
      <>
        {radiosArray.map(radioItem => {
          return (
            <TouchableOpacity
              key={`${radioItem.name}_${radioItem.id}`}
              style={styles.btn}
              onPress={() => handleOptionSelect(radioItem)}>
              <View style={styles.optionsContainer}>
                <View
                  style={[
                    styles.circle,
                    selectedOption.label === radioItem.label &&
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
    </>
  );
};

export default CustomRadioButton;
