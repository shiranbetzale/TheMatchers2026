import React, {useMemo} from 'react';
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
  const {values, onChange} = props;

  const matchFormArrayBeforeFiltered: CollapseSingleType[] = useMemo(
    () => groupBy(matchFormArray, 'collapseTitle'),
    [],
  );

  const matchFormArrayFiltered = useMemo(
    () =>
      matchFormArrayBeforeFiltered.map(section => ({
        ...section,
        data: getVisibleFields(section.data, values, matchFormArray),
      })),
    [matchFormArrayBeforeFiltered, values],
  );

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
      onChange(option.name, option.label);
      onChange(`${option.name}OptionId`, String(option.id));
    }
  };

  return (
    <CustomCollapse
      sections={matchFormArrayFiltered.map(section => ({
        ...section,
        data: section.data.map(field => ({
          ...field,
          options: getVisibleOptions(field, values, matchFormArray),
          value: values[field.id] ?? '',
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
