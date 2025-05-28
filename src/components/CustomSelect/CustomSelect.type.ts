import { Option } from "../../utils/FormFields.type";

export type CustomSelectType = {
  text: string;
  options: Option[];
  onSelect: (option?: Option) => void;
};
