import React from 'react';
import {ScrollView, View} from 'react-native';
import FilterFields from '../../utils/FilterFields';
import generateField from '../../utils/GenerateField';
import CustomButton from '../CustomButton/CustomButton';
import {styles} from './CustomFilter.style';
import {CustomFilterType} from './CustomFilter.type';

const CustomFilter = (props: CustomFilterType) => {
  const {onApply = () => {}, onReset = () => {}} = props;

  let i = -2;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.actions}>
        <CustomButton
          customStyle={styles.actionButton}
          text="התחל חיפוש"
          onPress={onApply}
        />
        <CustomButton
          customStyle={styles.resetButton}
          text="איפוס ללא סינון"
          onPress={onReset}
        />
      </View>

      {FilterFields.map(() => {
        i += 2;
        return (
          i < FilterFields.length && (
            <View key={i} style={styles.filterFieldContainer}>
              <View style={styles.filterField}>
                <View>{generateField({...FilterFields[i]})}</View>
              </View>
              {FilterFields[i + 1] && (
                <View style={styles.filterField}>
                  <View>{generateField({...FilterFields[i + 1]})}</View>
                </View>
              )}
            </View>
          )
        );
      })}
    </ScrollView>
  );
};

export default CustomFilter;
