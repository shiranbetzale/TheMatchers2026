import React from 'react';
import { FontsStyle } from '../../utils/FontsStyle';
import CustomButton from '../CustomButton/CustomButton';
import CustomText from '../CustomText/CustomText';
import { styles } from './CustomCollapse.style';
import { CustomTitleCollapseType } from './CustomCollapse.type';

const CustomTitleCollapse = (props: CustomTitleCollapseType) => {
  const { title, handlePress } = props;

  return (
    <CustomButton onPress={handlePress} customStyle={styles.collapseBtn}>
      <CustomText customStyle={FontsStyle.textDecoration} text={title} />
    </CustomButton>
  );
};

export default CustomTitleCollapse;
