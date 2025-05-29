import React, {useState} from 'react';
import {View} from 'react-native';
import {styles} from './CustomSelect.style';
import SelectDropdown from 'react-native-select-dropdown';
import {CustomSelectType} from './CustomSelect.type';
import CustomText from '../CustomText/CustomText';
import {FontsStyle} from '../../utils/FontsStyle';

const CustomSelect = (props: CustomSelectType) => {
  const {text, options, onSelect = () => {}} = props;

  return (
    <View style={styles.container}>
      <CustomText text={text} />
      {/* <SelectDropdown
        defaultButtonText="בחר/י מתוך הרשימה"
        data={options.map(option => option.label)}
        rowTextStyle={FontsStyle.text}
        buttonStyle={[styles.dropdownRow, styles.select]}
        buttonTextStyle={FontsStyle.text}
        selectedRowStyle={styles.dropdownRow}
        onSelect={(selectedItem, index) => {
          const selectOption = options.find(option => option.label === selectedItem)
          onSelect(selectOption)
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem
        }}
        rowTextForSelection={(item, index) => {
          return item
        }}
      /> */}
    </View>
  );
};

export default CustomSelect;
