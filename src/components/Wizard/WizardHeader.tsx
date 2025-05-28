import React from 'react';
import {styles} from './Wizard.style';
import {WizardHeaderType} from './Wizard.type';
import CustomButton from '../CustomButton/CustomButton';
import {View} from 'react-native';
import CustomText from '../CustomText/CustomText';

const WizardHeader = (props: WizardHeaderType) => {
  const {btnAProps, btnBProps, textProps} = props;

  return (
    <View style={styles.wizardContainer}>
      <CustomButton
        isDisabled={btnAProps?.isBtnDis}
        text={btnAProps?.btnTxt}
        onPress={btnAProps?.btnFunc}
      />
      <CustomText customStyle={textProps?.customStyle} text={textProps?.text} />
      <CustomButton
        isDisabled={btnBProps?.isBtnDis}
        text={btnBProps?.btnTxt}
        onPress={btnBProps?.btnFunc}
      />
    </View>
  );
};

export default WizardHeader;
