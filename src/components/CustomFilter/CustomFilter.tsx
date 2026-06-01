import React, {useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';
import FilterFields from '../../utils/FilterFields';
import {Option} from '../../utils/FormFields.type';
import generateField from '../../utils/GenerateField';
import CustomButton from '../CustomButton/CustomButton';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomFilter.style';
import {CustomFilterType} from './CustomFilter.type';

const CustomFilter = (props: CustomFilterType) => {
  const {
    values = {},
    isMyCards = false,
    matcherName,
    matcherOptions = [],
    onApply = () => {},
    onReset = () => {},
  } = props;

  const [name, setName] = useState(values.name || '');
  const [city, setCity] = useState(values.city || '');
  const [gender, setGender] = useState<'' | 'male' | 'female'>(
    values.gender || '',
  );
  const [selectedMatcherName, setSelectedMatcherName] = useState(
    values.matcherName || matcherName || '',
  );
  const [isMyCardsValue, setIsMyCardsValue] = useState(
    Boolean(values.isMyCards ?? isMyCards),
  );

  const filterFields = useMemo(
    () => [
      {
        id: 'name',
        text: 'nameLabel',
        keyboardTypeOption: 'default' as const,
        fieldType: 'input' as const,
        value: name,
        onChangeText: setName,
        isSmallSize: true,
      },
      {
        id: 'city',
        text: 'cityLabel',
        fieldType: 'autocomplete' as const,
        options: [],
        autocompleteSource: 'israelCities' as const,
        value: city,
        onChangeText: setCity,
        isSmallSize: true,
      },
      {
        id: 'matcherName',
        text: 'cardMatchmaker',
        fieldType: 'select' as const,
        value: selectedMatcherName,
        isEditable: !matcherName,
        options: matcherOptions,
        handlePress: (option?: Option | boolean) =>
          setSelectedMatcherName(
            option && typeof option !== 'boolean' ? option.label || '' : '',
          ),
        isSmallSize: true,
      },
      {
        id: 'isMyCards',
        text: 'myCards',
        fieldType: 'switch' as const,
        value: String(isMyCardsValue),
        handlePress: (value?: Option | boolean) =>
          setIsMyCardsValue(Boolean(value)),
        isSmallSize: true,
      },
      {
        id: 'gender',
        text: 'genderLabel',
        fieldType: 'radioButton' as const,
        options: [
          {id: 1, name: 'gender', label: 'male'},
          {id: 2, name: 'gender', label: 'female'},
        ],
        value: gender || undefined,
        handlePress: (option?: Option | boolean) => {
          if (!option || typeof option === 'boolean') {
            setGender('');
            return;
          }

          setGender(option.label === 'female' ? 'female' : 'male');
        },
        isSmallSize: true,
      },
      ...FilterFields.filter(
        field =>
          !['name', 'city', 'matcherName', 'isMyCards', 'gender'].includes(
            field.id,
          ),
      ),
    ],
    [
      city,
      gender,
      isMyCardsValue,
      matcherName,
      matcherOptions,
      name,
      selectedMatcherName,
    ],
  );

  const handleApply = () => {
    onApply({
      name: name.trim() || undefined,
      city: city.trim() || undefined,
      gender,
      matcherName: selectedMatcherName || undefined,
      isMyCards: isMyCardsValue,
    });
  };

  const handleReset = () => {
    setName('');
    setCity('');
    setGender('');
    setSelectedMatcherName(matcherName || '');
    setIsMyCardsValue(Boolean(isMyCards));
    onReset();
  };

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <View style={styles.header}>
          <CustomText text="filter" customStyle={styles.title} />
        </View>

        <ScrollView
          style={styles.fieldsScroll}
          contentContainerStyle={styles.fields}
          keyboardShouldPersistTaps="handled">
          {filterFields.map(field => (
            <View
              key={field.id}
              style={[
                styles.filterField,
                field.fieldType === 'range' && styles.rangeField,
              ]}>
              {generateField({
                ...field,
                isSmallSize: false,
              })}
            </View>
          ))}
        </ScrollView>

        <View style={styles.actions}>
          <CustomButton
            customStyle={styles.actionButton}
            customTextStyle={styles.actionButtonText}
            text="startSearch"
            onPress={handleApply}
          />
          <CustomButton
            customStyle={styles.resetButton}
            customTextStyle={styles.resetButtonText}
            text="reset"
            onPress={handleReset}
          />
        </View>
      </View>
    </View>
  );
};

export default CustomFilter;
