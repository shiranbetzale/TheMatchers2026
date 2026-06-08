import {KeyboardTypeOptions, TextInputProps} from 'react-native';

export type CustomInputType = {
  maxLength?: number;
  isSmallSize?: boolean;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  inputMode?: TextInputProps['inputMode'];
  onlyDigits?: boolean;
  formatWithCommas?: boolean;
  secureTextEntry?: boolean;
  allowToggleSecure?: boolean;
  isMultiline?: boolean;
  isEditable?: boolean;
  errorText?: string;
  defaultValue?: string | number;
  value?: string | number;
  onChangeText?: (text: string) => void;
  autoCapitalize?: TextInputProps['autoCapitalize'];
};
