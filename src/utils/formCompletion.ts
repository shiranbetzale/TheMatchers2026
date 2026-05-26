import {FormField} from './FormFields.type';

const isFilled = (value: unknown) =>
  value !== undefined && value !== null && String(value).trim().length > 0;

export const getSelectedConditionValue = (
  fieldId: string,
  values: Record<string, string>,
  fields: FormField[],
) => {
  const storedOptionId = values[`${fieldId}OptionId`];

  if (storedOptionId) {
    return storedOptionId;
  }

  const value = values[fieldId];
  const field = fields.find(item => item.id === fieldId);
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

  return conditions.some(
    condition =>
      getSelectedConditionValue(condition.fieldId, values, fields) ===
      condition.value,
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
  field.options?.filter(option =>
    isConditionListMatched(option.isShow, values, fields),
  );

export const isRequiredFieldComplete = (
  field: FormField,
  values: Record<string, string>,
) => {
  if (field.fieldType === 'switch' || field.fieldType === 'range') {
    return true;
  }

  return isFilled(values[field.id]);
};

export const getVisibleFields = (
  fields: FormField[],
  values: Record<string, string>,
  allFields = fields,
) => fields.filter(field => isFieldVisible(field, values, allFields));

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
