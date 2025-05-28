import { Option } from "../../utils/FormFields.type";

export type CustomRadioButtonType = {
  radiosArray: Option[];
  text: string;
  onSelect: (option?: Option) => void;
};