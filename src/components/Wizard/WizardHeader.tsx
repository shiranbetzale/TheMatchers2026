import React from 'react';
import {styles} from './Wizard.style';
import {WizardHeaderType} from './Wizard.type';
import CustomButton from '../CustomButton/CustomButton';
import {View} from 'react-native';
import CustomText from '../CustomText/CustomText';
import {useLanguage} from '../../utils/LanguageProvider';

const WizardHeader = (props: WizardHeaderType) => {
  const {btnAProps, btnBProps, textProps, currentStep, totalSteps} = props;
  const {isRTL} = useLanguage();
  const progressItems = Array.from(
    {length: totalSteps},
    (_, index) => index + 1,
  );
  const stepCaption = isRTL
    ? `שלב ${currentStep} מתוך ${totalSteps}`
    : `Step ${currentStep} of ${totalSteps}`;

  return (
    <View style={styles.wizardContainer}>
      <View style={styles.headerTopRow}>
        {btnAProps?.isBtnDis ? (
          <View style={styles.btnPlaceholder} />
        ) : (
          <CustomButton
            customStyle={styles.btn}
            customTextStyle={styles.btnText}
            text={btnAProps?.btnTxt}
            onPress={btnAProps?.btnFunc}
          />
        )}
        <View style={styles.titleContainer}>
          <CustomText
            customStyle={[styles.title, textProps?.customStyle]}
            text={textProps?.text ?? ''}
          />
          <CustomText customStyle={styles.stepCaption} text={stepCaption} />
        </View>
        <CustomButton
          customStyle={[styles.btn, styles.primaryBtn]}
          customTextStyle={[styles.btnText, styles.primaryBtnText]}
          isDisabled={btnBProps?.isBtnDis}
          text={btnBProps?.btnTxt}
          onPress={btnBProps?.btnFunc}
        />
      </View>
      <View style={styles.progressTrack}>
        {progressItems.map(step => (
          <View
            key={step}
            style={[
              styles.progressDot,
              step <= currentStep && styles.progressDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default WizardHeader;
