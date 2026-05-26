import { Option } from "../../utils/FormFields.type";

export type CustomCheckBoxType = {
  text: string;
  isSmallSize?: boolean;
  isEditable?: boolean;
  options: Option[];
  onChange?: (option: Option, value: boolean) => void;
};
