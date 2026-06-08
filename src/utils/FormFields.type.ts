import {TextInputProps} from 'react-native';

export type Option = {
  id: number;
  name: string;
  label: string;
  value?: string;
  originalLabel?: string;
  genderLabels?: {
    male: string;
    female: string;
  };
  isShow?: Condition[];
  hideWhen?: Condition[];
  isSmallSize?: boolean;
};

export type Condition = {
  fieldId: string;
  value: string;
  operator?: 'eq' | 'neq';
};

export type FormField = {
  id: string;
  collapseTitle?: string;
  defaultValue?: string | number;
  value?: string | number;
  text: string;
  genderTextLabels?: {
    male: string;
    female: string;
  };
  isMultiline?: boolean;
  isEditable?: boolean;
  allowClear?: boolean;
  errorText?: string;
  keyboardTypeOption?: 'default' | 'numeric';
  inputMode?: TextInputProps['inputMode'];
  onlyDigits?: boolean;
  formatWithCommas?: boolean;
  fieldType:
    | 'checkbox'
    | 'range'
    | 'input'
    | 'select'
    | 'autocomplete'
    | 'datePicker'
    | 'switch'
    | 'radioButton';
  options?: Option[];
  autocompleteSource?: 'israelCities';
  handlePress?: (option?: Option | boolean) => void;
  minRange?: number;
  maxRange?: number;
  step?: number;
  validation?: any;
  condition?: Condition[];
  maxDate?: Date;
  isSmallSize?: boolean;
  maxLength?: number;
  contextValues?: Record<string, string>;
  onChangeText?: (value: string) => void;
  onChangeDate?: (date: Date) => void;
};
