import React, {useMemo} from 'react';
import {ScrollView, View} from 'react-native';
import FilterFields from '../../utils/FilterFields';
import generateField from '../../utils/GenerateField';
import CustomButton from '../CustomButton/CustomButton';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomFilter.style';
import {CustomFilterType} from './CustomFilter.type';

const CustomFilter = (props: CustomFilterType) => {
  const {
    isMyCards = false,
    matcherName,
    matcherOptions = [],
    onApply = () => {},
    onReset = () => {},
  } = props;

  const filterFields = useMemo(
    () => [
      {
        id: 'matcherName',
        text: 'cardMatchmaker',
        fieldType: 'select' as const,
        value: matcherName,
        isEditable: !matcherName,
        options: matcherOptions,
        isSmallSize: true,
      },
      ...FilterFields.map(field =>
        field.id === 'isMyCards'
          ? {
              ...field,
              value: String(isMyCards),
            }
          : field,
      ),
    ],
    [isMyCards, matcherName, matcherOptions],
  );

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
            onPress={onApply}
          />
          <CustomButton
            customStyle={styles.resetButton}
            customTextStyle={styles.resetButtonText}
            text="reset"
            onPress={onReset}
          />
        </View>
      </View>
    </View>
  );
};

export default CustomFilter;
