import {ComponentType} from 'react';
import {StyleProp, TextStyle} from 'react-native';

export type WizardFormValues = Record<string, string>;

export type WizardStepComponentProps = {
  values: WizardFormValues;
  fieldErrors: WizardFormValues;
  onChange: (id: string, value: string) => void;
  onChangeMany: (values: WizardFormValues) => void;
};

export type WizardStep = {
  id: number;
  name: string;
  title: string;
  comp: ComponentType<WizardStepComponentProps>;
};

export type WizardBtnType = {
  isBtnDis?: boolean;
  btnTxt: string;
  btnFunc: () => void;
};

export type WizardTxtType = {
  customStyle?: StyleProp<TextStyle>;
  text?: string;
};

export type WizardHeaderType = {
  btnAProps: WizardBtnType;
  btnBProps: WizardBtnType;
  textProps: WizardTxtType;
  currentStep: number;
  totalSteps: number;
};
