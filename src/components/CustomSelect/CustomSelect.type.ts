import {Option} from '../../utils/FormFields.type';

export type CustomSelectType = {
  text: string;
  options: Option[];
  value?: string | number;
  isEditable?: boolean;
  onSelect: (option?: Option) => void;
};
