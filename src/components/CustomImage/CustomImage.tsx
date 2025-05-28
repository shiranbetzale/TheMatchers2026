import React from 'react';
import { Image } from 'react-native';
import { styles } from './CustomImage.style';
import { CustomImageType } from './CustomImage.type';

const CustomImage = (props: CustomImageType) => {
  const { src, customImgStyle } = props;

  return (
    <Image
      style={[styles.container, customImgStyle]}
      source={{ uri: src }}
    />
  );
};

export default CustomImage;
