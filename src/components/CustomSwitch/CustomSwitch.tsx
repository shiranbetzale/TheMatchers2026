import React, {useState} from 'react';
import {View, Switch, StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomSwitch.style';
import {CustomSwitchType} from './CustomSwitch.type';

const CustomSwitch = (props: CustomSwitchType) => {
  const {text, isMaxWidth = false} = props;
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <View style={styles.switchText}>
        <CustomText text={text} customStyle={styles.text} />
      </View>
      <View style={styles.switch}>
        <Switch
          trackColor={{false: Colors.black, true: Colors.border}}
          thumbColor={isEnabled ? Colors.btn : Colors.white}
          ios_backgroundColor={Colors.black}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
};

export default CustomSwitch;
