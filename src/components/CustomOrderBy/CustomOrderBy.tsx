import React from 'react';
import {ScrollView, View} from 'react-native';
import generateField from '../../utils/GenerateField';
import OrderByFields from '../../utils/OrderByFields';
import CustomButton from '../CustomButton/CustomButton';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomOrderBy.style';
import {CustomOrderByType} from './CustomOrderBy.type';

const CustomOrderBy = (props: CustomOrderByType) => {
  const {onApply = () => {}, onReset = () => {}} = props;

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <View style={styles.header}>
          <CustomText text="sort" customStyle={styles.title} />
        </View>

        <ScrollView
          style={styles.fieldsScroll}
          contentContainerStyle={styles.fields}
          keyboardShouldPersistTaps="handled">
          {OrderByFields.map(item => (
            <View key={item.id} style={styles.field}>
              {generateField({...item})}
            </View>
          ))}
        </ScrollView>

        <View style={styles.actions}>
          <CustomButton
            customStyle={styles.actionButton}
            customTextStyle={styles.actionButtonText}
            text="startSort"
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

export default CustomOrderBy;
