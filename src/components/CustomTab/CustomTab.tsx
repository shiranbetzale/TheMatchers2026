import React from 'react';
import {View} from 'react-native';
import CustomButton from '../CustomButton/CustomButton';
import {styles} from './CustomTab.style';
import {CustomTabType} from './CustomTab.type';
import { useLanguage } from '../../utils/LanguageProvider';

const CustomTab = (props: CustomTabType) => {
  const {tabs = [], activeTab = 0, onTabPress} = props;
  const { isRTL } = useLanguage();

  return (
    <View style={[styles.tabContainer, isRTL ? styles.rowReverse : styles.row]}>
      {tabs.map((tab, index) => {
        return (
          <View
            style={[
              styles.tabBorder,
              isRTL ? styles.tabBorderRtl : styles.tabBorderLtr,
            ]}
            key={`tab_${index}`}
          >
            <CustomButton
              text={tab.label}
              customStyle={[
                styles.tab,
                index === activeTab && styles.activeTab,
              ]}
              customTextStyle={[
                styles.tabText,
                index === activeTab && styles.activeTabTxt,
              ]}
              onPress={() => onTabPress(index)}
            />
            <View style={index < tabs.length - 1 && [
              styles.borderLeft,
              isRTL ? styles.separatorRtl : styles.separatorLtr,
            ]} />
          </View>
        );
      })}
    </View>
  );
};

export default CustomTab;
