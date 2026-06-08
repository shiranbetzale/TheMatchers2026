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
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(image => {
        if (typeof image === 'string') {
          return {uri: image};
        }

        if (image && typeof image === 'object' && 'uri' in image) {
          return image as UploadedPicture;
        }

        return null;
      })
      .filter((image): image is UploadedPicture => Boolean(image?.uri));
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
