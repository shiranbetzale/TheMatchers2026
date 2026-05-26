import React from 'react';
import CustomButton from '../CustomButton/CustomButton';
import CustomText from '../CustomText/CustomText';
import { styles } from './CustomCollapse.style';
import { CustomTitleCollapseType } from './CustomCollapse.type';

const CustomTitleCollapse = (props: CustomTitleCollapseType) => {
  const { title, handlePress, isDisabled } = props;

  return (
    <CustomButton
      onPress={handlePress}
      customStyle={[styles.collapseBtn, isDisabled && styles.lockedCollapseBtn]}
      isDisabled={isDisabled}>
      <CustomText customStyle={styles.collapseTitle} text={title} />
    </CustomButton>
  );
};

export default CustomTitleCollapse;
