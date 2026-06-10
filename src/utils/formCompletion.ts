import {FormField} from './FormFields.type';

const isFilled = (value: unknown) =>
  value !== undefined && value !== null && String(value).trim().length > 0;

const PHONE_FIELD_IDS = new Set(['phone', 'rabbiPhone']);
const MULTI_PHONE_FIELD_IDS = new Set(['phonesForInquiries']);
const EMAIL_FIELD_IDS = new Set(['mail', 'email']);

const normalizePhoneDigits = (value: string) => value.replace(/\D/g, '');

const isValidIsraeliMobilePhone = (value: string) => {
  const digits = normalizePhoneDigits(value);

  return /^05\d{8}$/.test(digits) || /^9725\d{8}$/.test(digits);
};

const splitPhoneList = (value: string) =>
  value
    .split(/[\n,;]+/)
    .map(item => item.trim())
    .filter(Boolean);

const isSingleConditionMatched = (
  condition: NonNullable<FormField['condition']>[number],
  values: Record<string, string>,
  fields: FormField[],
) => {
  const currentValue = getSelectedConditionValue(
    condition.fieldId,
    values,
    fields,
  );
  const currentValues = Array.isArray(currentValue)
    ? currentValue
    : [currentValue];
  const isMatched = currentValues.map(String).includes(condition.value);

  if (condition.operator === 'neq') {
    return !isMatched;
  }

  return isMatched;
};

const parseMultiValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }

  if (value === undefined || value === null || value === '') {
    return null;
  }

  const rawValue = String(value);

  try {
    const parsed = JSON.parse(rawValue);

    if (Array.isArray(parsed)) {
      return parsed.map(item => String(item));
    }
  } catch {
    return null;
  }

  return null;
};

export const getSelectedConditionValue = (
  fieldId: string,
  values: Record<string, string>,
  fields: FormField[],
) => {
  const storedOptionId = values[`${fieldId}OptionId`];
  const field = fields.find(item => item.id === fieldId);

  if (storedOptionId) {
    const selectedOption = field?.options?.find(
      option => String(option.id) === String(storedOptionId),
    );

    if (
      selectedOption &&
      !isConditionListMatched(selectedOption.isShow, values, fields)
    ) {
      return '';
    }

    if (
      selectedOption?.hideWhen?.length &&
      selectedOption.hideWhen.every(condition =>
        isSingleConditionMatched(condition, values, fields),
      )
    ) {
      return '';
    }

    return storedOptionId;
  }

  const value = values[fieldId];

  const multiValue = parseMultiValue(value);

  if (multiValue) {
    return multiValue.flatMap(item => {
      const option = field?.options?.find(
        nextOption =>
          nextOption.label === item ||
          nextOption.name === item ||
          String(nextOption.id) === item,
      );

      return option ? [String(option.id), option.label, option.name] : [item];
    });
  }

  const option = field?.options?.find(item => item.label === value);

  return option ? String(option.id) : value;
};

export const isConditionListMatched = (
  conditions: FormField['condition'],
  values: Record<string, string>,
  fields: FormField[],
) => {
  if (!conditions?.length) {
    return true;
  }

  return conditions.some(condition =>
    isSingleConditionMatched(condition, values, fields),
  );
};

export const isFieldVisible = (
  field: FormField,
  values: Record<string, string>,
  fields: FormField[],
) => {
  if (!field.condition?.length) {
    return true;
  }

  return isConditionListMatched(field.condition, values, fields);
};

export const getVisibleOptions = (
  field: FormField,
  values: Record<string, string>,
  fields: FormField[],
) =>
  field.options
    ?.filter(option => isConditionListMatched(option.isShow, values, fields))
    .filter(option => {
      if (!option.hideWhen?.length) {
        return true;
      }

      return !option.hideWhen.every(condition =>
        isSingleConditionMatched(condition, values, fields),
      );
    });

export const getVisibleFields = (
  fields: FormField[],
  values: Record<string, string>,
  allFields = fields,
) => fields.filter(field => isFieldVisible(field, values, allFields));

export const isRequiredFormField = (field: FormField) =>
  field.fieldType !== 'switch' &&
  field.fieldType !== 'range' &&
  field.fieldType !== 'checkbox';

export const isRequiredFieldComplete = (
  field: FormField,
  values: Record<string, string>,
) => {
  if (!isRequiredFormField(field)) {
    return true;
  }

  return isFilled(values[field.id]);
};

export const isSectionComplete = (
  fields: FormField[],
  values: Record<string, string>,
  allFields = fields,
) =>
  getVisibleFields(fields, values, allFields).every(field =>
    isRequiredFieldComplete(field, values),
  );

export const isFormComplete = (
  fields: FormField[],
  values: Record<string, string>,
) =>
  getVisibleFields(fields, values, fields).every(field =>
    isRequiredFieldComplete(field, values),
  );

export const validateWizardField = (
  id: string,
  value: string,
  values: Record<string, string> = {},
) => {
  const cleanValue = String(value || '').trim();

  if (!cleanValue) {
    return '';
  }

  if (PHONE_FIELD_IDS.has(id)) {
    return isValidIsraeliMobilePhone(cleanValue) ? '' : 'invalidPhone';
  }

  if (MULTI_PHONE_FIELD_IDS.has(id)) {
    const phones = splitPhoneList(cleanValue);

    return phones.length > 0 && phones.every(isValidIsraeliMobilePhone)
      ? ''
      : 'invalidPhone';
  }

  if (EMAIL_FIELD_IDS.has(id)) {
    const normalizedEmail = cleanValue.toLowerCase();

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
      ? ''
      : 'invalidEmail';
  }

  if (id === 'hight') {
    const isMetersFormat = /^([1-2])\.(\d{1,2})$/.test(cleanValue);
    const isCentimetersFormat = /^\d{3}$/.test(cleanValue);

    if (!isMetersFormat && !isCentimetersFormat) {
      return 'invalidHeight';
    }

    const heightInCm = isMetersFormat
      ? Number(cleanValue) * 100
      : Number(cleanValue);

    return heightInCm >= 120 && heightInCm <= 220 ? '' : 'invalidHeight';
  }

  if (id === 'hozerBitshoveAge') {
    if (!/^\d+$/.test(cleanValue)) {
      return 'invalidBaalTeshuvaAge';
    }

    const baalTeshuvaAge = Number(cleanValue);
    const age = Number(values.age);

    if (baalTeshuvaAge < 0) {
      return 'invalidBaalTeshuvaAge';
    }

    if (Number.isFinite(age) && age > 0 && baalTeshuvaAge > age) {
      return 'invalidBaalTeshuvaAge';
    }
  }

  return '';
};

export const normalizeWizardFieldValue = (id: string, value: string) => {
  const cleanValue = String(value || '').trim();

  if (PHONE_FIELD_IDS.has(id)) {
    return normalizePhoneDigits(cleanValue);
  }

  if (MULTI_PHONE_FIELD_IDS.has(id)) {
    const normalizedPhones = splitPhoneList(cleanValue).map(normalizePhoneDigits);

    return normalizedPhones.length ? normalizedPhones.join(', ') : cleanValue;
  }

  if (EMAIL_FIELD_IDS.has(id)) {
    return cleanValue.toLowerCase();
  }

  if (id !== 'hight') {
    return value;
  }

  if (/^\d{3}$/.test(cleanValue)) {
    return `${cleanValue[0]}.${cleanValue.slice(1)}`;
  }

  return value;
};

export const hasVisibleFieldErrors = (
  fields: FormField[],
  values: Record<string, string>,
  errors: Record<string, string>,
) =>
  getVisibleFields(fields, values, fields).some(field =>
    Boolean(errors[field.id]),
  );
