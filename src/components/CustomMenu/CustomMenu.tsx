import React from 'react';
import {View} from 'react-native';
// import MenuSvg from '../../assets/images/bluetooth.svg';
import {FontsStyle} from '../../utils/FontsStyle';
import CustomButton from '../CustomButton/CustomButton';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomMenu.style';
import {CustomMenuType} from './CustomMenu.type';

const CustomMenu = (props: CustomMenuType) => {
  const {onPressMenu, title} = props;

  return (
    <View style={styles.container}>
      <CustomButton onPress={() => onPressMenu()} customStyle={styles.menuBtn}>
        {/* <MenuSvg /> */}
      </CustomButton>
      <CustomText text={title} customTxtStyle={FontsStyle.textDecoration} />
    </View>
  );
};

export default CustomMenu;
