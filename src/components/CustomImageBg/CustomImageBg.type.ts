import { ReactNode } from "react";
import { ImageSourcePropType, ViewStyle } from "react-native";

export type CustomImageBgType = {
  src: ImageSourcePropType;
  customImgStyle?: ViewStyle;
  children?: ReactNode;
};
