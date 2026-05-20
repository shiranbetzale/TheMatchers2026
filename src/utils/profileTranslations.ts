type TranslateFn = (key: string) => string;

const profileValueKeys: Record<string, string> = {
  'בני ברק': 'profileValues.bneiBrak',
  'Bnei Brak': 'profileValues.bneiBrak',
  רווק: 'profileValues.single',
  Single: 'profileValues.single',
  גרוש: 'profileValues.divorced',
  Divorced: 'profileValues.divorced',
  אלמן: 'profileValues.widower',
  Widower: 'profileValues.widower',
  זכר: 'male',
  Male: 'male',
  נקבה: 'female',
  Female: 'female',
};

export const translateProfileValue = (
  value: string | number | undefined,
  t: TranslateFn,
) => {
  if (value === undefined || typeof value === 'number') {
    return value;
  }

  const key = profileValueKeys[value];
  return key ? t(key) : value;
};
