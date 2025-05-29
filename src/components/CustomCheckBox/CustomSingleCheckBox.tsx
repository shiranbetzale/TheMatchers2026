import React, { useState } from "react";
import CheckBox from '@react-native-community/checkbox';
import { styles } from "./CustomCheckBox.style";
import CustomText from "../CustomText/CustomText";
import Colors from "../../utils/Colors";
import { Option } from "../../utils/FormFields.type";
import { FontsStyle } from "../../utils/FontsStyle";

const CustomSingleCheckBox = (props: Option) => {
  const { id, label, isSmallSize = false } = props;
  const [isSelected, setSelection] = useState(false);

  return (
    <>
      <CustomText text={label} customStyle={FontsStyle.text} />
      <CheckBox
        // hideBox={true}
        boxType="square"
        value={isSelected}
        onValueChange={setSelection}
        style={isSmallSize ? styles.smallCheckbox : styles.checkbox}
        key={`checkBox_${id}`}
        onFillColor={Colors.color1}
        onCheckColor={Colors.white}
        onTintColor={Colors.color1}
        tintColor={Colors.black}
        tintColors={{ true: Colors.color1, false: Colors.black }}
      />
    </>
  );
};



export default CustomSingleCheckBox;