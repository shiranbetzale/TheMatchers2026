import { KeyboardTypeOptions } from 'react-native';

export type CustomInputType = {
  placeholder: string;
  value?: string | number; // ← הוספנו את הערך כאן
  keyboardType?: KeyboardTypeOptions;
  inputMode?: 'numeric' | 'text';
  onlyDigits?: boolean;
  secureTextEntry?: boolean;
  allowToggleSecure?: boolean;
  isMultiline?: boolean;
  isEditable?: boolean;
  defaultValue?: string | number;
  isSmallSize?: boolean;
  maxLength?: number;
  onChangeText?: (input: any) => void;
};
