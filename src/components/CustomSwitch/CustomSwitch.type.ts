export type CustomSwitchType = {
  text: string;
  handleToggle?: (isOn: boolean) => void;
  isSmallSize?: boolean;
  isEditable?: boolean;
  value?: boolean | string | number;
};
