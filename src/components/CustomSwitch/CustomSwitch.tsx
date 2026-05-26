import React, {useEffect, useState} from 'react';
import {Switch, View} from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomSwitch.style';
import {CustomSwitchType} from './CustomSwitch.type';
import {useLanguage} from '../../utils/LanguageProvider';

const CustomSwitch = (props: CustomSwitchType) => {
  const {
    isEditable = true,
    isSmallSize = false,
    text,
    value,
    handleToggle = () => {},
  } = props;
  const {isRTL} = useLanguage();
  const [isEnabled, setIsEnabled] = useState(
    value === true || value === 'true',
  );

  useEffect(() => {
    setIsEnabled(value === true || value === 'true');
  }, [value]);

  const toggleSwitch = () => {
    if (!isEditable) {
      return;
    }

    handleToggle(!isEnabled);
    setIsEnabled(previousState => !previousState);
  };

  return (
    <View
      style={[
        styles.container,
        isSmallSize && styles.smallContainer,
        isRTL ? styles.rowReverse : styles.row,
      ]}>
      <View style={styles.switchText}>
        <CustomText
          text={text}
          customStyle={[
            FontsStyle.questionLabel,
            styles.text,
            isRTL ? styles.textRight : styles.textLeft,
          ]}
        />
      </View>
      <View
        style={[
          styles.switch,
          isSmallSize && styles.smallSwitch,
          isRTL ? styles.alignEnd : styles.alignStart,
        ]}>
        <Switch
          trackColor={{false: '#c8d0dc', true: Colors.color1}}
          thumbColor={isEnabled ? Colors.darkGreen : Colors.white}
          ios_backgroundColor="#c8d0dc"
          onValueChange={toggleSwitch}
          value={isEnabled}
          disabled={!isEditable}
        />
      </View>
    </View>
  );
};

export default CustomSwitch;
