import React, { useState } from "react";
import CheckBox from '@react-native-community/checkbox';
import { styles } from "./CustomCheckBox.style";
import CustomText from "../CustomText/CustomText";
import Colors from "../../utils/Colors";
import { Option } from "../../utils/FormFields.type";
import { FontsStyle } from "../../utils/FontsStyle";

type SingleCheckBoxProps = Option & {
  onChange?: (option: Option, value: boolean) => void;
};

const CustomSingleCheckBox = (props: SingleCheckBoxProps) => {
  const { id, label, isSmallSize = false, onChange } = props;
  const [isSelected, setSelection] = useState(false);

  const handleToggle = (next: boolean) => {
    setSelection(next);
    onChange?.(props, next);
  };

  return (
    <>
      <CustomText text={label} customStyle={FontsStyle.text} />
      <CheckBox
        // hideBox={true}
        boxType="square"
        value={isSelected}
        onValueChange={handleToggle}
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
