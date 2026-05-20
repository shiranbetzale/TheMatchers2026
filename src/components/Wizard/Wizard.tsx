import React, { useState } from 'react';
import { View } from 'react-native';
import { styles } from './Wizard.style';
import { WizardBtnType, WizardTxtType, WizardStep } from './Wizard.type';
import { FontsStyle } from '../../utils/FontsStyle';
import WizardHeader from './WizardHeader';
import Step1Screen from '../../screens/Step1Screen/Step1Screen';
import Step2Screen from '../../screens/Step2Screen/Step2Screen';
import Step3Screen from '../../screens/Step3Screen/Step3Screen';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import Colors from '../../utils/Colors';

const Wizard = () => {
  const [wizardStep, setWizardStep] = useState<number>(1);

  const wizardSteps: WizardStep[] = [
    { id: 1, name: "Step1", title: "קצת עלי", comp: Step1Screen },
    { id: 2, name: "Step2", title: "על בן/ת הזוג", comp: Step2Screen },
    { id: 3, name: "Step3", title: "העלאת תמונות", comp: Step3Screen }
  ];

  const currentStep = wizardSteps.find(step => step.id === wizardStep);

  const renderComp = () => {
    const SpecificStep = currentStep?.comp;
    return SpecificStep ? <SpecificStep /> : null;
  };

  const goToStep = (step: number) => {
    if(step >= 1 && step <= wizardSteps.length) {
      setWizardStep(step);
    }
  };

  const btnAProps: WizardBtnType = {
    isBtnDis: wizardStep <= 1,
    btnTxt: "הקודם",
    btnFunc: () => goToStep(wizardStep - 1)
  };

  const btnBProps: WizardBtnType = {
    isBtnDis: wizardStep >= wizardSteps.length,
    btnTxt: "הבא",
    btnFunc: () => goToStep(wizardStep + 1)
  };

  const txtProps: WizardTxtType = {
    customStyle: [FontsStyle.wizardTitle, { color: Colors.white }],
    text: currentStep?.title || ''
  };

  return (
    <HomeScreen pinChildren={
      <WizardHeader
        btnAProps={btnAProps}
        btnBProps={btnBProps}
        textProps={txtProps}
      />}
    >
      <View style={styles.containerDynamicComp}>
        {renderComp()}
      </View>
    </HomeScreen>
  );
};

export default Wizard;
