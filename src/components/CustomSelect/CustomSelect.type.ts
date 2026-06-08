import {Option} from '../../utils/FormFields.type';

export type CustomSelectType = {
  text: string;
  options: Option[];
  value?: string | number;
  isEditable?: boolean;
  allowClear?: boolean;
  layout?: 'row' | 'column';
  onSelect: (option?: Option) => void;
};
