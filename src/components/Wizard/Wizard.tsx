import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {AxiosError} from 'axios';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {styles} from './Wizard.style';
import {
  WizardBtnType,
  WizardFormValues,
  WizardTxtType,
  WizardStep,
} from './Wizard.type';
import WizardHeader from './WizardHeader';
import Step1Screen from '../../screens/Step1Screen/Step1Screen';
import Step2Screen from '../../screens/Step2Screen/Step2Screen';
import Step3Screen from '../../screens/Step3Screen/Step3Screen';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import detailsFormArray from '../../utils/DetailsFormFields';
import matchFormArray from '../../utils/MatchFormFields';
import {isFormComplete} from '../../utils/formCompletion';
import {RootStackParamList} from '../MainStackNavigation/MainStackNavigation.type';
import {FormField} from '../../utils/FormFields.type';
import ErrorBanner from '../ErrorBanner/ErrorBanner';
import api from '../../services/api';

type WizardNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type WizardRouteProp = RouteProp<RootStackParamList, 'Wizard'>;

const getInitialWizardValues = (fields: FormField[]) =>
  fields.reduce<WizardFormValues>((initialValues, field) => {
    if (field.defaultValue !== undefined) {
      initialValues[field.id] = String(field.defaultValue);
    }

    if (field.fieldType === 'radioButton' && field.options?.length) {
      const defaultOption = field.options[0];
      initialValues[field.id] = defaultOption.label;
      initialValues[`${field.id}OptionId`] = String(defaultOption.id);
    }

    return initialValues;
  }, {});

type ProfilePayload = Record<string, unknown>;

const buildProfilePayload = (values: WizardFormValues): ProfilePayload => {
  const entries = Object.entries(values).filter(([key, value]) => {
    if (key.endsWith('OptionId')) {
      return false;
    }

    if (value === undefined || value === null) {
      return false;
    }

    return String(value).trim().length > 0;
  });

  const payload: ProfilePayload = Object.fromEntries(entries);

  if (typeof payload.images === 'string') {
    try {
      payload.images = JSON.parse(payload.images);
    } catch {
      payload.images = [];
    }
  }

  return payload;
};

const Wizard = () => {
  const navigation = useNavigation<WizardNavigationProp>();
  const route = useRoute<WizardRouteProp>();
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [submitErrorKey, setSubmitErrorKey] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<WizardFormValues>(() =>
    getInitialWizardValues([...detailsFormArray, ...matchFormArray]),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wizardSteps: WizardStep[] = [
    {id: 1, name: 'Step1', title: 'wizardAboutMe', comp: Step1Screen},
    {id: 2, name: 'Step2', title: 'wizardPartner', comp: Step2Screen},
    {id: 3, name: 'Step3', title: 'uploadPictures', comp: Step3Screen},
  ];

  const currentStep =
    wizardSteps.find(step => step.id === wizardStep) ?? wizardSteps[0];

  useEffect(() => {
    if (!route.params?.resetToken) {
      return;
    }

    setWizardStep(1);
    setSubmitErrorKey(null);
    setFormValues(
      getInitialWizardValues([...detailsFormArray, ...matchFormArray]),
    );
  }, [route.params?.resetToken]);

  const isStepComplete = (step: number) => {
    if (step === 1) {
      return isFormComplete(detailsFormArray, formValues);
    }

    if (step === 2) {
      return isFormComplete(matchFormArray, formValues);
    }

    return step === 3;
  };

  const updateFormValue = (id: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const updateFormValues = (values: WizardFormValues) => {
    setFormValues(prev => ({
      ...prev,
      ...values,
    }));
  };

  const renderComp = () => {
    const SpecificStep = currentStep?.comp;
    return SpecificStep ? (
      <SpecificStep
        values={formValues}
        onChange={updateFormValue}
        onChangeMany={updateFormValues}
      />
    ) : null;
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= wizardSteps.length) {
      setWizardStep(step);
    }
  };

  const finishWizard = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = buildProfilePayload(formValues);

      await api.post('/api/profiles', payload);

      setSubmitErrorKey(null);
      navigation.navigate('AllCardsScreen');
    } catch (error) {
      const axiosError = error as AxiosError<{message?: string}>;

      if (axiosError.response?.status === 409) {
        setSubmitErrorKey('candidateAlreadyExists');
        return;
      }

      setSubmitErrorKey('errorServer');
    } finally {
      setIsSubmitting(false);
    }
  };
  const btnAProps: WizardBtnType = {
    isBtnDis: wizardStep <= 1,
    btnTxt: 'previous',
    btnFunc: () => goToStep(wizardStep - 1),
  };

  const btnBProps: WizardBtnType = {
    isBtnDis: isSubmitting || !isStepComplete(wizardStep),
    btnTxt: wizardStep === wizardSteps.length ? 'finish' : 'next',
    btnFunc: () =>
      wizardStep === wizardSteps.length
        ? finishWizard()
        : goToStep(wizardStep + 1),
  };

  const txtProps: WizardTxtType = {
    text: currentStep?.title || '',
  };

  return (
    <HomeScreen
      disableScroll
      pinChildren={
        <WizardHeader
          btnAProps={btnAProps}
          btnBProps={btnBProps}
          textProps={txtProps}
          currentStep={wizardStep}
          totalSteps={wizardSteps.length}
        />
      }>
      <View style={styles.containerDynamicComp}>
        {submitErrorKey && (
          <View style={styles.errorContainer}>
            <ErrorBanner message={submitErrorKey} />
          </View>
        )}
        {renderComp()}
      </View>
    </HomeScreen>
  );
};

export default Wizard;
