import {KeyboardTypeOptions, TextInputProps} from 'react-native';

export type CustomInputType = {
  maxLength?: number;
  isSmallSize?: boolean;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  inputMode?: TextInputProps['inputMode'];
  onlyDigits?: boolean;
  secureTextEntry?: boolean;
  allowToggleSecure?: boolean;
  isMultiline?: boolean;
  isEditable?: boolean;
  value?: string | number;
  onChangeText?: (text: string) => void;
  autoCapitalize?: TextInputProps['autoCapitalize'];
};
