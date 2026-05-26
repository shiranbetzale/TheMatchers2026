import React, { useState } from "react";
import {Text, TouchableOpacity, View} from "react-native";
import { styles } from "./CustomCheckBox.style";
import CustomText from "../CustomText/CustomText";
import { Option } from "../../utils/FormFields.type";

type SingleCheckBoxProps = Option & {
  isRTL?: boolean;
  isEditable?: boolean;
  onChange?: (option: Option, value: boolean) => void;
};

const CustomSingleCheckBox = (props: SingleCheckBoxProps) => {
  const {
    id,
    isEditable = true,
    isRTL = false,
    label,
    isSmallSize = false,
    onChange,
  } = props;
  const [isSelected, setSelection] = useState(false);

  const handleToggle = (next: boolean) => {
    if (!isEditable) {
      return;
    }

    setSelection(next);
    onChange?.(props, next);
  };

  return (
    <React.Fragment>
      <TouchableOpacity
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
      </TouchableOpacity>
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
