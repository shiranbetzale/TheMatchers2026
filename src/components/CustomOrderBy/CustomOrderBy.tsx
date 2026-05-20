import React from 'react';
import { View } from 'react-native';
import generateField from '../../utils/GenerateField';
import OrderByFields from '../../utils/OrderByFields';
import CustomButton from '../CustomButton/CustomButton';
import { styles } from './CustomOrderBy.style';
import { CustomOrderByType } from './CustomOrderBy.type';

const CustomOrderBy = (props: CustomOrderByType) => {
  const { } = props;

  return (
    <View style={styles.container}>
      <CustomButton customStyle={styles.btn} text='איפוס לברירת מחדל' onPress={() => { }} />
      {
        OrderByFields.map((item, index) => {
          return <View key={index}>
            {generateField({ ...item })}
          </View>
        })
      }
    </View >
  );
};

export default CustomOrderBy;
