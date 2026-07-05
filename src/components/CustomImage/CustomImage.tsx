import React, {useEffect, useMemo, useState} from 'react';
import {Image} from 'react-native';
import {CustomImageType} from './CustomImage.type';
import {getDefaultProfileImage} from '../../utils/generalFunction';
import SharedStyles from '../../utils/SharedStyles';

const DEFAULT_IMAGE_URI = getDefaultProfileImage();
export const HIGH_QUALITY_IMAGE_PROPS = {
  resizeMethod: 'resize',
  resizeMultiplier: 3,
} as any;

const CustomImage = (props: CustomImageType) => {
  const {accessibilityLabel, src, customImgStyle} = props;
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const imageUri = useMemo(() => {
    if (hasError) {
      return DEFAULT_IMAGE_URI;
    }
    return src && String(src).trim() ? src : DEFAULT_IMAGE_URI;
  }, [hasError, src]);

  return (
    <Image
      {...HIGH_QUALITY_IMAGE_PROPS}
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel}
      style={[SharedStyles.flex, customImgStyle]}
      source={{uri: imageUri}}
      resizeMode="cover"
      onError={() => setHasError(true)}
    />
  );
};

export default CustomImage;
