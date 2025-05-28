import { ReactNode } from "react";
import { ViewStyle } from "react-native";

export type CustomButtonType = {
  onPress: () => void;
  text?: string;
  customStyle?: ViewStyle;
  isDisabled?: boolean;
  children?: ReactNode;
};
