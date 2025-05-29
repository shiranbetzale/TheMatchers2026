import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import FilterFields from '../../utils/FilterFields';
import generateField from '../../utils/GenerateField';
import CustomButton from '../CustomButton/CustomButton';
import CustomText from '../CustomText/CustomText';
import { styles } from './CustomFilter.style';
import { CustomFilterType } from './CustomFilter.type';

const CustomFilter = (props: CustomFilterType) => {
  const { } = props;

  let i = -2;

  return (
    <ScrollView style={styles.container}>
      <CustomButton text='איפוס ללא סינון' onPress={() => { }} />
      {
        FilterFields.map(() => {
          i += 2;
          return i <= FilterFields.length && <View key={i} style={styles.filterFieldContainer}>
            <View style={styles.filterField}>
              <View>
                {generateField({ ...FilterFields[i] })}
              </View>
            </View>
            <View style={styles.filterField}>
              <View>
                {generateField({ ...FilterFields[i + 1] })}
              </View>
            </View>
          </View>
        })
      }
    </ScrollView>
  );
};

export default CustomFilter;
