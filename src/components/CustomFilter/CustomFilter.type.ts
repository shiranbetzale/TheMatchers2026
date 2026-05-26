export type CustomFilterType = {
  isMyCards?: boolean;
  matcherName?: string;
  matcherOptions?: {id: number; name: string; label: string}[];
  onApply?: () => void;
  onReset?: () => void;
};
