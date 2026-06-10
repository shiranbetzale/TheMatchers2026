import React from 'react';
import CustomCheckBox from '../components/CustomCheckBox/CustomCheckBox';
import CustomAutocomplete from '../components/CustomAutocomplete/CustomAutocomplete';
import CustomDatePicker from '../components/CustomDatePicker/CustomDatePicker';
import CustomInput from '../components/CustomInput/CustomInput';
import CustomRadioButton from '../components/CustomRadioButton/CustomRadioButton';
import CustomRange from '../components/CustomRange/CustomRange';
import CustomSelect from '../components/CustomSelect/CustomSelect';
import CustomSwitch from '../components/CustomSwitch/CustomSwitch';
import {FormField, Option} from './FormFields.type';
import i18n from './i18n';

const t = (key?: string | number) => {
  if (key === undefined || key === null) {
    return '';
  }

  const translation = i18n.t(String(key));
  return typeof translation === 'string' && translation !== ''
    ? translation
    : String(key);
};

const getGenderKey = (contextValues?: Record<string, string>) => {
  const targetGender = String(contextValues?.genderLabelTarget || '').trim();

  if (targetGender === 'male' || targetGender === 'female') {
    return targetGender;
  }

  const gender = String(contextValues?.gender || '')
    .trim()
    .toLowerCase();
  const genderOptionId = String(contextValues?.genderOptionId || '').trim();

  if (
    genderOptionId === '1' ||
    gender === 'male' ||
    gender === 'זכר' ||
    gender === '1'
  ) {
    return 'male';
  }

  if (
    genderOptionId === '2' ||
    gender === 'female' ||
    gender === 'נקבה' ||
    gender === '2'
  ) {
    return 'female';
  }

  return undefined;
};

const getFieldTextKey = (
  text: string,
  genderTextLabels?: {
    male: string;
    female: string;
  },
  contextValues?: Record<string, string>,
) => {
  const genderKey = getGenderKey(contextValues);

  return genderKey && genderTextLabels?.[genderKey]
    ? genderTextLabels[genderKey]
    : text;
};

const getOptionLabelKey = (
  option: Option,
  contextValues?: Record<string, string>,
) => {
  const genderKey = getGenderKey(contextValues);

  return genderKey && option.genderLabels?.[genderKey]
    ? option.genderLabels[genderKey]
    : option.label;
};

const translateOptions = (
  options: Option[] = [],
  contextValues?: Record<string, string>,
) =>
  options.map(option => ({
    ...option,
    originalLabel: option.label,
    label: t(getOptionLabelKey(option, contextValues)),
  }));

const parseArrayValue = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }

  if (value === undefined || value === null || value === '') {
    return [];
  }

  const rawValue = String(value);

  try {
    const parsed = JSON.parse(rawValue);

    if (Array.isArray(parsed)) {
      return parsed.map(item => String(item));
    }
  } catch {
    // Fall through to comma parsing.
  }

  return rawValue
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
};

const parseRangeValue = (
  value: unknown,
  minRange = 0,
  maxRange = 0,
): number[] => {
  const normalizeRange = (items: unknown[]) => {
    const numbers = items.map(item => Number(item));

    if (numbers.length !== 2 || numbers.some(item => !Number.isFinite(item))) {
      return null;
    }

    return numbers;
  };

  if (Array.isArray(value)) {
    const parsedRange = normalizeRange(value);

    if (parsedRange) {
      return parsedRange;
    }
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return [minRange, value];
  }

  if (value && typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;
    const parsedRange = normalizeRange([
      objectValue.min ?? objectValue.from ?? objectValue[0],
      objectValue.max ?? objectValue.to ?? objectValue[1],
    ]);

    if (parsedRange) {
      return parsedRange;
    }
  }

  if (value !== undefined && value !== null && value !== '') {
    const rawValue = String(value).trim();

    try {
      const parsed = JSON.parse(rawValue);

      if (Array.isArray(parsed)) {
        const parsedRange = normalizeRange(parsed);

        if (parsedRange) {
          return parsedRange;
        }
      }

      if (parsed && typeof parsed === 'object') {
        const parsedObject = parsed as Record<string, unknown>;
        const parsedRange = normalizeRange([
          parsedObject.min ?? parsedObject.from ?? parsedObject[0],
          parsedObject.max ?? parsedObject.to ?? parsedObject[1],
        ]);

        if (parsedRange) {
          return parsedRange;
        }
      }
    } catch {
      const commaParts = rawValue.split(',').map(item => item.trim());
      const parsedRange = normalizeRange(commaParts);

      if (parsedRange) {
        return parsedRange;
      }
    }

    const numericValue = Number(rawValue);

    if (Number.isFinite(numericValue)) {
      return [minRange, numericValue];
    }
  }

  return [minRange, maxRange];
};

const generateField = (props: FormField) => {
  const {
    maxLength,
    isSmallSize,
    defaultValue,
    value,
    isRequired,
    maxDate,
    isEditable,
    allowClear,
    errorText,
    minRange,
    maxRange,
    step,
    isMultiline,
    text,
    keyboardTypeOption,
    inputMode,
    onlyDigits,
    formatWithCommas,
    fieldType,
    options,
    autocompleteSource,
    genderTextLabels,
    contextValues,
    onChangeText,
    onChangeDate,
    handlePress = () => {},
  } = props;
  const translatedText = t(
    getFieldTextKey(text, genderTextLabels, contextValues),
  );
  const fieldText = isRequired ? `* ${translatedText} ` : translatedText;
  const translatedOptions = translateOptions(options, contextValues);
  const checkboxValue = parseArrayValue(value);

  switch (fieldType) {
    case 'input':
      return (
        <CustomInput
          text={fieldText}
          maxLength={maxLength}
          isSmallSize={isSmallSize}
          isMultiline={isMultiline}
          defaultValue={defaultValue}
          value={value}
          placeholder={translatedText}
          isEditable={isEditable}
          errorText={errorText}
          keyboardType={keyboardTypeOption || 'default'}
          inputMode={inputMode}
          onlyDigits={onlyDigits}
          formatWithCommas={formatWithCommas}
          onChangeText={onChangeText}
        />
      );

    case 'radioButton':
      return (
        <CustomRadioButton
          isSmallSize={isSmallSize}
          text={fieldText}
          radiosArray={translatedOptions}
          value={value}
          isEditable={isEditable}
          onSelect={handlePress}
        />
      );

    case 'datePicker':
      return (
        <CustomDatePicker
          text={fieldText}
          value={value}
          maxDate={maxDate}
          isEditable={isEditable}
          onChangeDate={onChangeDate}
        />
      );

    case 'select':
      return (
        <CustomSelect
          text={fieldText}
          value={value}
          isEditable={isEditable}
          allowClear={allowClear}
          onSelect={handlePress}
          options={translatedOptions}
        />
      );

    case 'autocomplete':
      return (
        <CustomAutocomplete
          text={fieldText}
          value={value}
          isSmallSize={isSmallSize}
          isEditable={isEditable}
          options={translatedOptions}
          autocompleteSource={autocompleteSource}
          onChangeText={onChangeText}
          onSelect={handlePress}
        />
      );

    case 'switch':
      return (
        <CustomSwitch
          isSmallSize={isSmallSize}
          text={fieldText}
          value={value}
          isEditable={isEditable}
          handleToggle={handlePress}
        />
      );

    case 'checkbox':
      return (
        <CustomCheckBox
          isSmallSize={isSmallSize}
          text={fieldText}
          options={translatedOptions}
          value={checkboxValue}
          isEditable={isEditable}
          onChange={(option, isSelected) => {
            const optionValue = String(option.id);
            const nextValue = isSelected
              ? Array.from(new Set([...checkboxValue, optionValue]))
              : checkboxValue.filter(
                  item =>
                    item !== optionValue &&
                    item !== option.label &&
                    item !== option.name,
                );

            onChangeText?.(JSON.stringify(nextValue));
          }}
        />
      );

    case 'range':
      return (
        <CustomRange
          isSmallSize={isSmallSize}
          text={translatedText}
          step={step || 0}
          minRange={minRange || 0}
          maxRange={maxRange || 0}
          value={parseRangeValue(value, minRange || 0, maxRange || 0)}
          onChange={nextValue => onChangeText?.(JSON.stringify(nextValue))}
        />
      );

    default:
      return null;
  }
};

export default generateField;
