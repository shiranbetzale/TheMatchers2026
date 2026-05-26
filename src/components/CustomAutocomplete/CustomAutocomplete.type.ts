import {Option} from '../../utils/FormFields.type';

export type CustomAutocompleteType = {
  text: string;
  value?: string | number;
  options: Option[];
  autocompleteSource?: 'israelCities';
  isSmallSize?: boolean;
  isEditable?: boolean;
  onChangeText?: (value: string) => void;
  onSelect?: (option: Option) => void;
};
