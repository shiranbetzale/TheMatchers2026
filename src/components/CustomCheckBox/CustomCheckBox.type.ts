import { Option } from "../../utils/FormFields.type";

export type CustomCheckBoxType = {
  text: string;
  isSmallSize?: boolean;
  options: Option[];
  onChange?: (option: Option, value: boolean) => void;
};
