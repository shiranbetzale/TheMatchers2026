import React from 'react';
import { ImageBackground } from 'react-native';
import { CustomImageBgType } from './CustomImageBg.type';

const CustomImageBg = (props: CustomImageBgType) => {
  const { src, customImgStyle, children } = props;

  return (
    <ImageBackground
      source={src}
      resizeMode="cover"
      style={customImgStyle}>
      {children}
    </ImageBackground>
  );
};

export default CustomImageBg;
