export type CardsFilterValues = {
  name?: string;
  city?: string;
  gender?: 'male' | 'female' | '';
  matcherName?: string;
  isMyCards?: boolean;
};

export type CustomFilterType = {
  values?: CardsFilterValues;
  isMyCards?: boolean;
  matcherName?: string;
  nameOptions?: {id: number; name: string; label: string}[];
  matcherOptions?: {id: number; name: string; label: string}[];
  onApply?: (values: CardsFilterValues) => void;
  onReset?: () => void;
};
