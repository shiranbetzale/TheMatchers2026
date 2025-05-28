import { KeyboardTypeOptions } from "react-native";

export type CustomInputType = {
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
  isMultiline?: boolean;
  isEditable?: boolean;
  defaultValue?: string | number;
  isMaxWidth?: boolean;
};
