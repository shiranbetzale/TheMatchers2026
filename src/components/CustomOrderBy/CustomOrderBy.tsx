import React from 'react';
import {View} from 'react-native';
import generateField from '../../utils/GenerateField';
import OrderByFields from '../../utils/OrderByFields';
import CustomButton from '../CustomButton/CustomButton';
import {styles} from './CustomOrderBy.style';
import {CustomOrderByType} from './CustomOrderBy.type';

const CustomOrderBy = (props: CustomOrderByType) => {
  const {onApply = () => {}, onReset = () => {}} = props;

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <CustomButton
          customStyle={styles.btn}
          text="התחל מיון"
          onPress={onApply}
        />
        <CustomButton
          customStyle={styles.resetButton}
          text="איפוס לברירת מחדל"
          onPress={onReset}
        />
      </View>
      {OrderByFields.map((item, index) => {
        return <View key={index}>{generateField({...item})}</View>;
      })}
    </View>
  );
};

export default CustomOrderBy;
