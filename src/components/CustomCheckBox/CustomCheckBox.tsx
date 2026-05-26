import React from "react";
import { View } from "react-native";
import { CustomCheckBoxType } from "./CustomCheckBox.type";
import { styles } from "./CustomCheckBox.style";
import CustomText from "../CustomText/CustomText";
import CustomSingleCheckBox from "./CustomSingleCheckBox";
import {useLanguage} from "../../utils/LanguageProvider";
import {FontsStyle} from "../../utils/FontsStyle";

const CustomCheckBox = (props: CustomCheckBoxType) => {
  const { text, options, isEditable = true, isSmallSize = false, onChange } = props;
  const {isRTL} = useLanguage();

  return (
    <View
      style={[
        !isSmallSize && styles.container,
        styles.baseContainer,
        isRTL ? styles.alignRtl : styles.alignLtr,
      ]}>
      <CustomText
        text={text}
        customStyle={[
          FontsStyle.questionLabel,
          isRTL ? styles.textRight : styles.textLeft,
        ]}
      />
      <View
        pointerEvents={isEditable ? 'auto' : 'none'}
        style={[styles.cbContainer, isRTL ? styles.alignRtl : styles.alignLtr]}
      >
        {
          options.map((option, index) => {
            return <View
              key={option.id ?? index}
              style={[
                styles.checkboxContainer,
                isRTL ? styles.checkboxContainerRtl : styles.checkboxContainerLtr,
              ]}>
              <CustomSingleCheckBox
                {...option}
                isSmallSize={isSmallSize}
                isRTL={isRTL}
                isEditable={isEditable}
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
