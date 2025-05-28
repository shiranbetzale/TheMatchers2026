import React, {useState} from 'react';
import CheckBox from '@react-native-community/checkbox';
import {styles} from './CustomCheckBox.style';
import CustomText from '../CustomText/CustomText';
import Colors from '../../utils/Colors';
import {Option} from '../../utils/FormFields.type';
import {FontsStyle} from '../../utils/FontsStyle';

const CustomSingleCheckBox = (props: Option) => {
  const {id, label} = props;
  const [isSelected, setSelection] = useState(false);

  return (
    <>
      <CustomText text={label} customTxtStyle={FontsStyle.text} />
      <CheckBox
        // hideBox={true}
        boxType="square"
        value={isSelected}
        onValueChange={setSelection}
        style={styles.checkbox}
        key={`checkBox_${id}`}
        onFillColor={Colors.border}
        onCheckColor={Colors.white}
        onTintColor={Colors.border}
        tintColor={Colors.black}
        tintColors={{true: Colors.border, false: Colors.black}}
      />
    </>
  );
};

export default CustomSingleCheckBox;
