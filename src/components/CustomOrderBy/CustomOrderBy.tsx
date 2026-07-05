import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';

import generateField from '../../utils/GenerateField';
import {Option} from '../../utils/FormFields.type';
import OrderByFields from '../../utils/OrderByFields';
import CustomButton from '../CustomButton/CustomButton';
import CustomText from '../CustomText/CustomText';
import {orderByStyles as styles} from '../SelectionPanelStyles';
import {CardsSortValue, CustomOrderByType} from './CustomOrderBy.type';

const CustomOrderBy = (props: CustomOrderByType) => {
  const {value = '', onApply = () => {}, onReset = () => {}} = props;

  const [selectedOrderId, setSelectedOrderId] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    const selected = OrderByFields[0]?.options?.find(
      option => option.label === value,
    );

    setSelectedOrderId(selected?.id);
  }, [value]);

  const orderByField = useMemo(() => {
    const field = OrderByFields[0];

    if (!field) {
      return undefined;
    }

    return {
      ...field,
      value: selectedOrderId,
      handlePress: (option?: Option | boolean) =>
        setSelectedOrderId(
          option && typeof option !== 'boolean' ? option.id : undefined,
        ),
    };
  }, [selectedOrderId]);

  const handleApply = () => {
    const selected = OrderByFields[0]?.options?.find(
      option => option.id === selectedOrderId,
    );

    onApply((selected?.label ?? '') as CardsSortValue);
  };

  const handleReset = () => {
    setSelectedOrderId(undefined);
    onReset();
  };

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
          <View style={styles.field}>
            {orderByField && generateField(orderByField)}
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <CustomButton
            customStyle={styles.actionButton}
            customTextStyle={styles.actionButtonText}
            text="startSort"
            onPress={handleApply}
          />

          <CustomButton
            variant="secondary"
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

export default CustomOrderBy;
