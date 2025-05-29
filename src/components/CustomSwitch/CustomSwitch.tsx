import React, { useState } from "react";
import { View, Switch } from "react-native";
import Colors from "../../utils/Colors";
import CustomText from "../CustomText/CustomText";
import { styles } from "./CustomSwitch.style";
import { CustomSwitchType } from "./CustomSwitch.type";

const CustomSwitch = (props: CustomSwitchType) => {
  const { isSmallSize = false, text, handleToggle = () => { } } = props;
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    handleToggle(!isEnabled);
    setIsEnabled(previousState => !previousState)
  };

  return (
    <View style={!isSmallSize && styles.container}>
      <View style={!isSmallSize && styles.switchText}>
        <CustomText
          text={text}
          customStyle={styles.text}
        />
      </View>
      <View style={isSmallSize ? styles.smallSwitch : styles.switch}>
        <Switch
          trackColor={{ false: Colors.black, true: Colors.color1 }}
          thumbColor={isEnabled ? Colors.color1 : Colors.white}
          ios_backgroundColor={Colors.black}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
}


export default CustomSwitch;