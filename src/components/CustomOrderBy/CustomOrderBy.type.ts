export type CardsSortValue =
  | 'sortName'
  | 'sortAgeAsc'
  | 'sortAgeDesc'
  | 'sortCreatedAt'
  | '';

export type CustomOrderByType = {
  value?: CardsSortValue;
  onApply?: (value: CardsSortValue) => void;
  onReset?: () => void;
};
