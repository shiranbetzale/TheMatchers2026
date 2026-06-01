import React, {useMemo, useState} from 'react';
import { Image } from 'react-native';
import { styles } from './CustomImage.style';
import { CustomImageType } from './CustomImage.type';

const DEFAULT_IMAGE_URI =
  'https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg';

const CustomImage = (props: CustomImageType) => {
  const { src, customImgStyle } = props;
  const [hasError, setHasError] = useState(false);
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
