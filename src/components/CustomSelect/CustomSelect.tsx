import React, {useState} from 'react';
import {View} from 'react-native';
import {styles} from './CustomSelect.style';
import {CustomSelectType} from './CustomSelect.type';
import CustomText from '../CustomText/CustomText';
import {FontsStyle} from '../../utils/FontsStyle';
import {Dropdown} from 'react-native-element-dropdown';

const CustomSelect = ({
  text,
  options,
  onSelect = () => {},
}: CustomSelectType) => {
  const [selectedValue, setSelectedValue] = useState<string | number | null>(
    null,
  );

  const data = options.map(option => ({
    label: option.label,
    value: option.id,
  }));

  return (
    <View style={styles.container}>
      <CustomText text={text} />
      <Dropdown
        style={[styles.dropdownRow, styles.select]}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="בחר/י מתוך הרשימה"
        value={selectedValue}
        onChange={item => {
          setSelectedValue(item.value);
          const selectedOption = options.find(
            option => option.id === item.value,
          );
          onSelect(selectedOption);
        }}
        placeholderStyle={FontsStyle.text}
        selectedTextStyle={FontsStyle.text}
      />
    </View>
  );
};

export default CustomSelect;
