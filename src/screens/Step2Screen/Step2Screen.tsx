import React, {useEffect, useMemo} from 'react';
import matchFormArray from '../../utils/MatchFormFields';
import CustomCollapse from '../../components/CustomCollapse/CustomCollapse';
import {groupBy} from '../../utils/generalFunction';
import {CollapseSingleType} from '../../components/CustomCollapse/CustomCollapse.type';
import {Option} from '../../utils/FormFields.type';
import {WizardStepComponentProps} from '../../components/Wizard/Wizard.type';
import {
  getVisibleOptions,
  getVisibleFields,
  isSectionComplete,
} from '../../utils/formCompletion';

const Step2Screen = (props: WizardStepComponentProps) => {
  const {values, fieldErrors, onChange, onChangeMany} = props;
  const genderOptionId = String(values.genderOptionId || '').trim();
  const gender = String(values.gender || '').trim().toLowerCase();
  const partnerGender =
    genderOptionId === '1' || gender === 'male' || gender === 'זכר'
      ? 'female'
      : genderOptionId === '2' || gender === 'female' || gender === 'נקבה'
        ? 'male'
        : undefined;
  const partnerContextValues = partnerGender
    ? {
        ...values,
        genderLabelTarget: partnerGender,
      }
    : values;
  const isFemale =
    genderOptionId === '2' || gender === 'female' || gender === 'נקבה';
  const statusOptionId = String(values.statusOptionId || '').trim();
  const status = String(values.status || '').trim();
  const isDivorcedOrDivorcedWithChildren =
    statusOptionId === '3' ||
    statusOptionId === '5' ||
    status === 'divorcedStatus' ||
    status === 'divorcedWithChildrenStatus';
  const shouldHideCohenPreference =
    isFemale && isDivorcedOrDivorcedWithChildren;

  const matchFormArrayBeforeFiltered: CollapseSingleType[] = useMemo(
    () => groupBy(matchFormArray, 'collapseTitle'),
    [],
  );

  const matchFormArrayFiltered = useMemo(
    () =>
      matchFormArrayBeforeFiltered.map(section => ({
        ...section,
        data: getVisibleFields(section.data, values, matchFormArray).filter(
          field =>
            !(shouldHideCohenPreference && field.id === 'matchIsWantCohen'),
        ),
      })),
    [matchFormArrayBeforeFiltered, shouldHideCohenPreference, values],
  );

  useEffect(() => {
    if (shouldHideCohenPreference && values.matchIsWantCohen) {
      onChange('matchIsWantCohen', '');
    }
  }, [onChange, shouldHideCohenPreference, values.matchIsWantCohen]);

  const lockedSectionTitles = useMemo(() => {
    const lockedTitles: string[] = [];
    let canOpenNextSection = true;

    matchFormArrayFiltered.forEach(section => {
      if (!canOpenNextSection) {
        lockedTitles.push(section.title);
        return;
      }

      canOpenNextSection = isSectionComplete(
        section.data,
        values,
        matchFormArray,
      );
    });

    return lockedTitles;
  }, [matchFormArrayFiltered, values]);

  const handlePress = (option?: Option) => {
    if (option?.name) {
      onChangeMany({
        [option.name]: option.label,
        [`${option.name}OptionId`]: String(option.id),
        ...(option.name === 'matchZerem' && option.id !== 1
          ? {matchHasidut: ''}
          : {}),
        ...(option.name === 'matchZerem' && option.id !== 3
          ? {matchTribe: ''}
          : {}),
      });
    }
  };

  return (
    <CustomCollapse
      sections={matchFormArrayFiltered.map(section => ({
        ...section,
        data: section.data.map(field => ({
          ...field,
          errorText: fieldErrors[field.id],
          options: getVisibleOptions(field, values, matchFormArray),
          value: values[field.id] ?? '',
          contextValues: partnerContextValues,
          onChangeText: (value: string) => onChange(field.id, value),
        })),
      }))}
      handlePress={(option?: Option | boolean, fieldId?: string) => {
        if (typeof option === 'boolean' && fieldId) {
          onChange(fieldId, String(option));
        }

        if (option && typeof option !== 'boolean') {
          handlePress(option);
        }
      }}
      lockedSectionTitles={lockedSectionTitles}
      autoExpandUnlockedSection
    />
  );
};

export default Step2Screen;
