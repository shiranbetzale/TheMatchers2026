import React from 'react';
import {View} from 'react-native';
import CustomButton from '../CustomButton/CustomButton';
import {styles} from './CustomTab.style';
import {CustomTabType} from './CustomTab.type';
import {useLanguage} from '../../utils/LanguageProvider';

const CustomTab = (props: CustomTabType) => {
  const {tabs = [], activeTab = 0, onTabPress} = props;
  const {isRTL} = useLanguage();

  return (
    <View style={styles.tabContainer}>
      <View
        style={[
          styles.tabsRow,
          isRTL ? styles.rowReverse : styles.row,
        ]}>
        {tabs.map((tab, index) => {
          const isActive = index === activeTab;

          return (
            <CustomButton
              unstyled
              key={`tab_${index}`}
              text={tab.label}
              accessibilityRole="tab"
              accessibilityState={{selected: isActive}}
              customStyle={[styles.tab, isActive && styles.activeTab]}
              customTextStyle={[
                styles.tabText,
                isActive && styles.activeTabTxt,
              ]}
              onPress={() => onTabPress(index)}
            />
          );
        })}
      </View>
    </View>
  );
};

export default CustomTab;
