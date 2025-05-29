import React, {useEffect} from 'react';
import {View} from 'react-native';
import BackSvg from '../../assets/images/back.svg';
import MenuSvg from '../../assets/images/menu.svg';
import {FontsStyle} from '../../utils/FontsStyle';
import CustomButton from '../CustomButton/CustomButton';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomMenu.style';
import {CustomMenuType} from './CustomMenu.type';

const CustomMenu = (props: CustomMenuType) => {
  const {navigation, onPressMenu, title} = props;

  // const handleBackButtonClick = () => {
  //   navigation?.goBack();
  //   return true;
  // }

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
  //   return () => {
  //     BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
  //   };
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.menuTxtContainer}>
        <CustomButton
          onPress={() => onPressMenu()}
          icon={<MenuSvg width={24} height={24} />}
        />
        <CustomText text={title} customStyle={FontsStyle.menuTitle} />
      </View>
      <View>
        <CustomButton
          onPress={() => navigation.goBack()}
          icon={<BackSvg width={24} height={24} />}
        />
      </View>
    </View>
  );
};

export default CustomMenu;
