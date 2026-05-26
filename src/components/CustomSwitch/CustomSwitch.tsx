import React, {useEffect, useState} from 'react';
import {Switch, View} from 'react-native';
import Colors from '../../utils/Colors';
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
        !isSmallSize && styles.container,
        !isSmallSize && (isRTL ? styles.rowReverse : styles.row),
      ]}>
      <View style={!isSmallSize && styles.switchText}>
        <CustomText
          text={text}
          customStyle={[
            styles.text,
            isRTL ? styles.textRight : styles.textLeft,
          ]}
        />
      </View>
      <View
        style={[
          isSmallSize ? styles.smallSwitch : styles.switch,
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
