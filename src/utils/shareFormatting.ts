import detailsFormArray from './DetailsFormFields';
import i18n from './i18n';

const translate = (key?: string | number) => {
  if (key === undefined || key === null) {
    return '';
  }

  const cleanKey = String(key).trim();

  if (!cleanKey) {
    return '';
  }

  const translated = i18n.t(cleanKey);
  return typeof translated === 'string' && translated ? translated : cleanKey;
};

const parseOptionValues = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map(item => String(item)).filter(Boolean);
  }

  const rawValue = String(value || '').trim();

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (Array.isArray(parsed)) {
      return parsed.map(item => String(item)).filter(Boolean);
    }
  } catch {
    // Fall through to separator parsing.
  }

  return rawValue
    .split(/[\n,;]+|\s+ו\s+/)
    .map(item => item.trim())
    .filter(Boolean);
};

export const formatProfileOptionValue = (
  fieldId: string,
  value: unknown,
  gender?: string,
) => {
  const field = detailsFormArray.find(item => item.id === fieldId);

  if (!field?.options?.length) {
    return translate(String(value || ''));
  }

  const genderKey =
    gender === 'male' || gender === 'female' ? gender : undefined;

  const formattedValues = parseOptionValues(value).map(item => {
    const option = field.options?.find(
      nextOption =>
        String(nextOption.id) === item ||
        nextOption.label === item ||
        nextOption.name === item,
    );

    if (!option) {
      return translate(item);
    }

    return translate(
      genderKey && option.genderLabels?.[genderKey]
        ? option.genderLabels[genderKey]
        : option.label,
    );
  });

  return formattedValues.join(', ');
};
