import React from 'react';
import UploadPictures from '../../components/UploadPictures/UploadPictures';
import {UploadedPicture} from '../../components/UploadPictures/UploadPictures.type';
import {WizardStepComponentProps} from '../../components/Wizard/Wizard.type';

const parseImages = (value?: string): UploadedPicture[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const Step3Screen = (props: WizardStepComponentProps) => {
  const {values, onChange} = props;
  const images = parseImages(values.images);

  return (
    <UploadPictures
      images={images}
      onChange={nextImages => onChange('images', JSON.stringify(nextImages))}
    />
  );
};

export default Step3Screen;
