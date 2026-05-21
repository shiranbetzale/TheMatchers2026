import React from "react";
import { View } from "react-native";
import { CustomCheckBoxType } from "./CustomCheckBox.type";
import { styles } from "./CustomCheckBox.style";
import CustomText from "../CustomText/CustomText";
import CustomSingleCheckBox from "./CustomSingleCheckBox";
import {useLanguage} from "../../utils/LanguageProvider";

const CustomCheckBox = (props: CustomCheckBoxType) => {
  const { text, options, isSmallSize = false, onChange } = props;
  const {isRTL} = useLanguage();

  return (
    <View
      style={[
        !isSmallSize && styles.container,
        styles.baseContainer,
        isRTL ? styles.alignRtl : styles.alignLtr,
      ]}>
      <CustomText text={text} />
      <View style={[styles.cbContainer, isRTL ? styles.alignRtl : styles.alignLtr]}>
        {
          options.map((option, index) => {
            return <View key={option.id ?? index} style={styles.checkboxContainer}>
              <CustomSingleCheckBox
                {...option}
                isSmallSize={isSmallSize}
                isRTL={isRTL}
                onChange={onChange}
              />
            </View>
          })
        }
      </View>
    </View>

  );
};



export default CustomCheckBox;
