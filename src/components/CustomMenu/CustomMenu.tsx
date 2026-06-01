import React from 'react';
import {View} from 'react-native';
import BackSvg from '../../assets/images/back.svg';
import MenuSvg from '../../assets/images/menu.svg';
import CustomButton from '../CustomButton/CustomButton';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomMenu.style';
import {CustomMenuType} from './CustomMenu.type';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../MainStackNavigation/MainStackNavigation.type';
import {useLanguage} from '../../utils/LanguageProvider';

const CustomMenu = (props: CustomMenuType) => {
  const {isBackHidden = false, onPressMenu} = props;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {isRTL} = useLanguage();

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
    <View style={[styles.container, isRTL ? styles.rowReverse : styles.row]}>
      <View style={styles.topAccent} />
      <View
        style={[
          styles.menuTitleContainer,
          isRTL ? styles.rowReverse : styles.row,
        ]}>
        <CustomButton
          customStyle={styles.iconButton}
          onPress={() => onPressMenu()}
          icon={<MenuSvg width={24} height={24} />}
        />
        <CustomText
          text={isRTL ? 'השדכנים' : 'THE MATCHERS'}
          customStyle={styles.title}
        />
      </View>
      <View style={styles.sideSlot}>
        {!isBackHidden && (
          <CustomButton
            customStyle={styles.iconButton}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
            icon={<BackSvg width={24} height={24} />}
          />
        )}
      </View>
    </View>
  );
};

export default CustomMenu;
