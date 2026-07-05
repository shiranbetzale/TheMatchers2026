import React from 'react';
import { View } from 'react-native';
import CustomButton from '../CustomButton/CustomButton';
import CustomText from '../CustomText/CustomText';
import { styles } from './CustomHeader.style';
import { CustomHeaderType } from './CustomHeader.type';

const CustomHeader = (props: CustomHeaderType) => {
  const {actionsPosition = 'right', headerBtns, title} = props;
  const isActionsLeft = actionsPosition === 'left';

  return (
    <View style={[styles.header, isActionsLeft && styles.headerLeft]}>
      <View style={styles.actions}>
        {headerBtns.map((item, index) => {
          return (
            <CustomButton
              key={index}
              accessibilityLabel={item.accessibilityLabel}
              customStyle={styles.iconButton}
              onPress={item.onPress}
              icon={item.comp}
            />
          );
        })}
      </View>

      {title && (
        <View style={styles.titleContainer}>
          <CustomText text={title} customStyle={styles.title} />
        </View>
      )}

      <View style={styles.sidePlaceholder} />
    </View>
  );
};

export default CustomHeader;
