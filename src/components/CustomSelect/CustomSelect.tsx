import React, {useState} from 'react';
import {Modal, TouchableOpacity, View} from 'react-native';
import {styles} from './CustomSelect.style';
import {CustomSelectType} from './CustomSelect.type';
import CustomText from '../CustomText/CustomText';
import {Option} from '../../utils/FormFields.type';
import {useLanguage} from '../../utils/LanguageProvider';

const CustomSelect = (props: CustomSelectType) => {
  const {isEditable = true, onSelect, options, text, value} = props;
  const {isRTL} = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | undefined>();

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, isRTL ? styles.rowReverse : styles.row]}>
      <View style={styles.labelWrapper}>
        <CustomText
          text={text}
          customStyle={[
            styles.label,
            isRTL ? styles.rtlText : styles.ltrText,
          ]}
        />
      </View>

      <TouchableOpacity
        style={[styles.select, !isEditable && styles.readOnlySelect]}
        activeOpacity={0.8}
        disabled={!isEditable}
        onPress={() => setIsOpen(true)}>
        <CustomText
          text={selectedOption?.label || value || 'selectPlaceholder'}
          customStyle={[
            styles.selectText,
            isRTL ? styles.rtlText : styles.ltrText,
          ]}
        />
      </TouchableOpacity>

      <Modal
        transparent
        visible={isEditable && isOpen}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setIsOpen(false)}>
          <View style={styles.optionsContainer}>
            {options.map(option => (
              <TouchableOpacity
                key={`${option.name}_${option.id}`}
                style={styles.option}
                onPress={() => handleSelect(option)}>
                <CustomText
                  text={option.label}
                  customStyle={[
                    styles.optionText,
                    isRTL ? styles.rtlText : styles.ltrText,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomSelect;
