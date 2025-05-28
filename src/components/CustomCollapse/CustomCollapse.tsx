import React, { useState } from 'react';
import { SectionList } from 'react-native';
import generateField from '../../utils/GenerateField';
import WhiteCard from '../WhiteCard/WhiteCard';
import { styles } from './CustomCollapse.style';
import { CustomCollapseType } from './CustomCollapse.type';
import CustomTitleCollapse from './CustomTitleCollapse';

const CustomCollapse = (props: CustomCollapseType) => {
  const { sections, handlePress } = props;
  const [expandedSections, setExpandedSections] = useState(new Set());

  const handleToggle = (title: string) => {
    setExpandedSections((expandedSections) => {
      const next = new Set(expandedSections);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  return (
    <SectionList
      style={styles.container}
      sections={sections}
      extraData={expandedSections}
      keyExtractor={(item, index) => item + index}
      renderItem={({ section: { title }, item }) => {
        const isExpanded = expandedSections.has(title);
        if (!isExpanded) return null;
        return <WhiteCard customStyle={styles.whiteCardContainer}>
          {generateField({ ...item, handlePress })}
        </WhiteCard>
      }}
      renderSectionHeader={({ section: { title } }) => (
        <CustomTitleCollapse title={title} handlePress={() => handleToggle(title)} />
      )}
    />
  );
};

export default CustomCollapse;
