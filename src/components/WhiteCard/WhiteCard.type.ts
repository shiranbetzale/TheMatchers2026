import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export type WhiteCardType = {
  children: ReactNode;
  customStyle?: StyleProp<ViewStyle>;
};
