import React from 'react';
import {View} from 'react-native';
import BackSvg from '../../assets/images/back.svg';
import MenuSvg from '../../assets/images/menu.svg';
import CustomButton, {BUTTON_ICON_SIZE} from '../CustomButton/CustomButton';
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
  const {isRTL, t} = useLanguage();


  return (
    <View style={[styles.container, isRTL ? styles.rowReverse : styles.row]}>
      <View style={styles.topAccent} />
      <View
        style={[
          styles.menuTitleContainer,
          isRTL ? styles.rowReverse : styles.row,
        ]}>
        <CustomButton
          accessibilityLabel={t('openMenu')}
          customStyle={styles.iconButton}
          onPress={() => onPressMenu()}
          icon={<MenuSvg width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />}
        />
        <CustomText
          text={isRTL ? 'השדכנים' : 'THE MATCHERS'}
          customStyle={styles.title}
        />
      </View>
      <View style={styles.sideSlot}>
        {!isBackHidden && (
          <CustomButton
            accessibilityLabel={t('back')}
            customStyle={styles.iconButton}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
            icon={
              <BackSvg width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
            }
          />
        )}
      </View>
    </View>
  );
};

export default CustomMenu;
