import { ReactNode } from "react";
import { TextStyle, ViewStyle } from "react-native";

export type CustomButtonType = {
  onPress: () => void;
  text?: string;
  customStyle?: ViewStyle | ViewStyle[] | any;
  customTextStyle?: TextStyle | TextStyle[] | any;
  isDisabled?: boolean;
  children?: ReactNode;
  icon?: ReactNode;
};
