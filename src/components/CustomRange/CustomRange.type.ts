export type CustomRangeType = {
  minRange: number;
  maxRange: number;
  step: number;
  text: string;
  isSmallSize?: boolean;
  value?: number[];
  onChange?: (values: number[]) => void;
};
