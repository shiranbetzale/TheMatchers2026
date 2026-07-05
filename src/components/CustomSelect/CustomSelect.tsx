import React, {useEffect, useState} from 'react';
import CustomButton from '../CustomButton/CustomButton';
import CustomModal from '../CustomModal/CustomModal';
import {GestureResponderEvent, ScrollView, Text, View} from 'react-native';
import {styles} from './CustomSelect.style';
import {CustomSelectType} from './CustomSelect.type';
import CustomText from '../CustomText/CustomText';
import {Option} from '../../utils/FormFields.type';
import {useLanguage} from '../../utils/LanguageProvider';

const CustomSelect = (props: CustomSelectType) => {
  const {
    isEditable = true,
    allowClear = false,
    layout = 'row',
    onSelect,
    options,
    presentation = 'modal',
    text,
    value,
  } = props;
  const {isRTL, t} = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | undefined>();
  const isColumnLayout = layout === 'column';
  const selectedValue = String(value || '');
  const canClear = Boolean(allowClear && isEditable && selectedValue);
  const displayOption =
    selectedValue && selectedOption
      ? selectedOption
      : options.find(option => {
          const genderLabelValues = option.genderLabels
            ? Object.values(option.genderLabels)
            : [];

          return (
            String(option.id) === selectedValue ||
            option.label === selectedValue ||
            option.originalLabel === selectedValue ||
            option.name === selectedValue ||
            genderLabelValues.includes(selectedValue)
          );
        });

  useEffect(() => {
    if (!selectedValue) {
      setSelectedOption(undefined);
    }
  }, [selectedValue]);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  const handleClear = (event: GestureResponderEvent) => {
    event.stopPropagation();
    setSelectedOption(undefined);
    onSelect(undefined);
    setIsOpen(false);
  };

  const optionsList = (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always">
      {options.map(option => (
        <CustomButton
          unstyled
          accessibilityLabel={`${t(text)}: ${t(option.label)}`}
          accessibilityRole="radio"
          accessibilityState={{selected: option === displayOption}}
          key={`${option.name}_${option.id}_${option.value || option.label}`}
          style={styles.option}
          onPress={() => handleSelect(option)}>
          <CustomText
            text={option.label}
            customStyle={[
              styles.optionText,
              isRTL ? styles.textRight : styles.textLeft,
            ]}
          />
        </CustomButton>
      ))}
    </ScrollView>
  );

  return (
    <View
      style={[
        styles.container,
        isColumnLayout ? styles.column : isRTL ? styles.rowReverse : styles.row,
      ]}>
      <View
        style={[
          styles.labelWrapper,
          isColumnLayout && styles.labelWrapperColumn,
        ]}>
        <CustomText
          text={text}
          customStyle={[
            styles.label,
            isRTL ? styles.textRight : styles.textLeft,
          ]}
        />
      </View>

      <CustomButton
        unstyled
        accessibilityLabel={`${t(text)}: ${t(
          String(displayOption?.label || value || 'selectPlaceholder'),
        )}`}
        accessibilityRole="button"
        accessibilityState={{disabled: !isEditable, expanded: isOpen}}
        style={[
          styles.select,
          isColumnLayout && styles.selectColumn,
          !isEditable && styles.readOnlySelect,
        ]}
        activeOpacity={0.8}
        disabled={!isEditable}
        onPress={() => setIsOpen(true)}>
        <View style={[styles.selectContent, isRTL && styles.rowReverse]}>
          <CustomText
            text={displayOption?.label || value || 'selectPlaceholder'}
            customStyle={[
              styles.selectText,
              styles.selectContentText,
              isRTL ? styles.textRight : styles.textLeft,
            ]}
          />
          {canClear && (
            <CustomButton
              unstyled
              accessibilityRole="button"
              accessibilityLabel={t('clearSelection')}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
              style={styles.clearButton}
              onPress={handleClear}>
              <Text style={styles.clearButtonText}>x</Text>
            </CustomButton>
          )}
        </View>
      </CustomButton>

      {presentation === 'inline' ? (
        isEditable && isOpen ? (
          <View style={styles.inlineOptionsContainer}>{optionsList}</View>
        ) : null
      ) : (
        <CustomModal
          transparent
          visible={isEditable && isOpen}
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}>
          <CustomButton
            unstyled
            style={styles.overlay}
            activeOpacity={1}
            onPressOut={() => setIsOpen(false)}>
            <View style={styles.optionsContainer}>{optionsList}</View>
          </CustomButton>
        </CustomModal>
      )}
    </View>
  );
};

export default CustomSelect;
