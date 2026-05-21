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
          isRTL ? styles.alignRight : styles.alignLeft,
        ]}>
        {tabs.map((tab, index) => {
          const isLast = index === tabs.length - 1;

          return (
            <React.Fragment key={`tab_${index}`}>
              <View style={styles.tabBorder}>
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
              </View>
              {!isLast && <View style={styles.separator} />}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTab;
