import React from 'react';
import {View} from 'react-native';
import CustomButton from '../CustomButton/CustomButton';
import {styles} from './CustomTab.style';
import {CustomTabType} from './CustomTab.type';

const CustomTab = (props: CustomTabType) => {
  const {tabs = [], activeTab = 0, onTabPress} = props;

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => {
        return (
          <View style={styles.tabBorder} key={`tab_${index}`}>
            <CustomButton
              text={tab.label}
              customStyle={[
                styles.tab,
                index === activeTab && styles.activeTab,
              ]}
              customTextStyle={index === activeTab && styles.activeTabTxt}
              onPress={() => onTabPress(index)}
            />
            <View style={index < tabs.length - 1 && styles.borderLeft} />
          </View>
        );
      })}
    </View>
  );
};

export default CustomTab;
