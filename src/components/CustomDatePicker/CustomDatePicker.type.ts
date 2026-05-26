export type CustomDatePickerType = {
  text: string;
  value?: string | number;
  maxDate?: Date;
  isEditable?: boolean;
  onChangeDate?: (date: Date) => void;
};
