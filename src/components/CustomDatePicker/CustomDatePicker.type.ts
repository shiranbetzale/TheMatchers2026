export type CustomDatePickerType = {
  text: string;
  value?: string | number;
  maxDate?: Date;
  onChangeDate?: (date: Date) => void;
};
