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

const translateOptions = (options: Option[] = []) =>
  options.map(option => ({
    ...option,
    label: t(option.label),
  }));

const generateField = (props: FormField) => {
  const {
    maxLength,
    isSmallSize,
    defaultValue,
    value,
    maxDate,
    isEditable,
    minRange,
    maxRange,
    step,
    isMultiline,
    text,
    keyboardTypeOption,
    fieldType,
    options,
    autocompleteSource,
    onChangeText,
    onChangeDate,
    handlePress = () => {},
  } = props;
  const translatedText = t(text);
  const translatedOptions = translateOptions(options);

  switch (fieldType) {
    case 'input':
      return (
        <CustomInput
          maxLength={maxLength}
          isSmallSize={isSmallSize}
          isMultiline={isMultiline}
          defaultValue={defaultValue}
          value={value}
          placeholder={translatedText}
          isEditable={isEditable}
          keyboardType={keyboardTypeOption || 'default'}
          onChangeText={onChangeText}
        />
      );

    case 'radioButton':
      return (
        <CustomRadioButton
          isSmallSize={isSmallSize}
          text={translatedText}
          radiosArray={translatedOptions}
          value={value}
          isEditable={isEditable}
          onSelect={handlePress}
        />
      );

    case 'datePicker':
      return (
        <CustomDatePicker
          text={translatedText}
          value={value}
          maxDate={maxDate}
          isEditable={isEditable}
          onChangeDate={onChangeDate}
        />
      );

    case 'select':
      return (
        <CustomSelect
          text={translatedText}
          value={value}
          isEditable={isEditable}
          onSelect={handlePress}
          options={translatedOptions}
        />
      );

    case 'autocomplete':
      return (
        <CustomAutocomplete
          text={translatedText}
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
          text={translatedText}
          value={value}
          isEditable={isEditable}
          handleToggle={handlePress}
        />
      );

    case 'checkbox':
      return (
        <CustomCheckBox
          isSmallSize={isSmallSize}
          text={translatedText}
          options={translatedOptions}
          isEditable={isEditable}
          onChange={handlePress}
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
        />
      );

    default:
      return null;
  }
};

export default generateField;
