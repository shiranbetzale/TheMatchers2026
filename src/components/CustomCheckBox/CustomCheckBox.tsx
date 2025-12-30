import React from "react";
import { View } from "react-native";
import { CustomCheckBoxType } from "./CustomCheckBox.type";
import { styles } from "./CustomCheckBox.style";
import CustomText from "../CustomText/CustomText";
import CustomSingleCheckBox from "./CustomSingleCheckBox";

const CustomCheckBox = (props: CustomCheckBoxType) => {
  const { text, options, isSmallSize = false, onChange } = props;

  return (
    <View style={[!isSmallSize && styles.container, styles.baseContainer]}>
      <View style={styles.cbContainer}>
        {
          options.map((option, index) => {
            return <View key={option.id ?? index} style={styles.checkboxContainer}>
              <CustomSingleCheckBox
                {...option}
                isSmallSize={isSmallSize}
                onChange={onChange}
              />
            </View>
          })
        }
      </View>
      <CustomText text={text} />
    </View>

  );
};



export default CustomCheckBox;
