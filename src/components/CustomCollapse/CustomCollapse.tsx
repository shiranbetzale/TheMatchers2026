import React, {useEffect, useRef, useState} from 'react';
import { SectionList } from 'react-native';
import generateField from '../../utils/GenerateField';
import WhiteCard from '../WhiteCard/WhiteCard';
import { styles } from './CustomCollapse.style';
import { CustomCollapseType } from './CustomCollapse.type';
import CustomTitleCollapse from './CustomTitleCollapse';

const CustomCollapse = (props: CustomCollapseType) => {
  const {
    sections,
    handlePress,
    lockedSectionTitles = [],
    autoExpandUnlockedSection = false,
  } = props;
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );
  const previousLockedSectionTitles = useRef<string[]>(lockedSectionTitles);

  useEffect(() => {
    if (!autoExpandUnlockedSection || !sections.length) {
      previousLockedSectionTitles.current = lockedSectionTitles;
      return;
    }

    const sectionTitles = sections.map(section => section.title);
    const nextUnlockedTitle = sectionTitles.find(
      title =>
        previousLockedSectionTitles.current.includes(title) &&
        !lockedSectionTitles.includes(title),
    );
    const firstUnlockedTitle = sectionTitles.find(
      title => !lockedSectionTitles.includes(title),
    );

    setExpandedSections(currentExpandedSections => {
      if (nextUnlockedTitle) {
        return new Set([...currentExpandedSections, nextUnlockedTitle]);
      }

      if (!currentExpandedSections.size && firstUnlockedTitle) {
        return new Set([firstUnlockedTitle]);
      }

      return currentExpandedSections;
    });

    previousLockedSectionTitles.current = lockedSectionTitles;
  }, [autoExpandUnlockedSection, lockedSectionTitles, sections]);

  const handleToggle = (title: string) => {
    if (lockedSectionTitles.includes(title)) {
      return;
    }

    setExpandedSections((currentExpandedSections) => {
      const next = new Set(currentExpandedSections);
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
      contentContainerStyle={styles.contentContainer}
      sections={sections}
      extraData={{expandedSections, lockedSectionTitles}}
      keyExtractor={(item, index) => item + index}
      removeClippedSubviews={false}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      renderItem={({ section: { title }, item }) => {
        const isExpanded = expandedSections.has(title);
        if (!isExpanded || lockedSectionTitles.includes(title)) return null;
        return <WhiteCard customStyle={[
          styles.whiteCardContainer,
          item.fieldType === 'autocomplete' && styles.autocompleteCard,
        ]}>
          {generateField({
            ...item,
            handlePress: option => handlePress(option, item.id),
          })}
        </WhiteCard>
      }}
      renderSectionHeader={({ section: { title } }) => (
        <CustomTitleCollapse
          title={title}
          handlePress={() => handleToggle(title)}
          isDisabled={lockedSectionTitles.includes(title)}
        />
      )}
    />
  );
};

export default CustomCollapse;
