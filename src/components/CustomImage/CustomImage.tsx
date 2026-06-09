import React, {useEffect, useMemo, useState} from 'react';
import { Image } from 'react-native';
import { styles } from './CustomImage.style';
import { CustomImageType } from './CustomImage.type';
import {getDefaultProfileImage} from '../../utils/generalFunction';

const DEFAULT_IMAGE_URI = getDefaultProfileImage();

const CustomImage = (props: CustomImageType) => {
  const { src, customImgStyle } = props;
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
      style={[styles.container, customImgStyle]}
      source={{uri: imageUri}}
      resizeMode="cover"
      onError={() => setHasError(true)}
    />
  );
};

export default CustomImage;
