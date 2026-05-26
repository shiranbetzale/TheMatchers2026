import React, {useMemo} from 'react';
import CustomCollapse from '../../components/CustomCollapse/CustomCollapse';
import {CollapseSingleType} from '../../components/CustomCollapse/CustomCollapse.type';
import {WizardStepComponentProps} from '../../components/Wizard/Wizard.type';
import detailsFormArray from '../../utils/DetailsFormFields';
import {Option} from '../../utils/FormFields.type';
import {
  getVisibleOptions,
  getVisibleFields,
  isSectionComplete,
} from '../../utils/formCompletion';
import {calculateAge, formatHebrewDate, groupBy} from '../../utils/generalFunction';

const Step1Screen = (props: WizardStepComponentProps) => {
  const {values, onChange, onChangeMany} = props;

  const detailsFormArrayBeforeFiltered: CollapseSingleType[] = useMemo(
    () => groupBy(detailsFormArray, 'collapseTitle'),
    [],
  );

  const detailsFormArrayFiltered = useMemo(
    () =>
      detailsFormArrayBeforeFiltered.map(section => ({
        ...section,
        data: getVisibleFields(section.data, values, detailsFormArray),
      })),
    [detailsFormArrayBeforeFiltered, values],
  );

  const lockedSectionTitles = useMemo(() => {
    const lockedTitles: string[] = [];
    let canOpenNextSection = true;

    detailsFormArrayFiltered.forEach(section => {
      if (!canOpenNextSection) {
        lockedTitles.push(section.title);
        return;
      }

      canOpenNextSection = isSectionComplete(
        section.data,
        values,
        detailsFormArray,
      );
    });

    return lockedTitles;
  }, [detailsFormArrayFiltered, values]);

  const handlePress = (option?: Option) => {
    if (option?.name) {
      onChange(option.name, option.label);
      onChange(`${option.name}OptionId`, String(option.id));
    }
  };

  return (
    <CustomCollapse
      sections={detailsFormArrayFiltered.map(section => ({
        ...section,
        data: section.data.map(field => ({
          ...field,
          options: getVisibleOptions(field, values, detailsFormArray),
          value: values[field.id] ?? '',
          onChangeText: (value: string) => onChange(field.id, value),
          onChangeDate: (date: Date) => {
            if (field.id === 'birthDate') {
              onChangeMany({
                birthDate: date.toISOString(),
                birthDateHe: formatHebrewDate(date),
                age: String(calculateAge(date)),
              });
              return;
            }

            onChange(field.id, date.toISOString());
          },
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

export default Step1Screen;
