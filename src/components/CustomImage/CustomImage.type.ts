import { ReactNode } from "react";
import { ImageStyle } from "react-native";

export type CustomImageType = {
  src: string;
  customImgStyle?: ImageStyle;
  children?: ReactNode;
};
