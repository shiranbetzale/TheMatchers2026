import React, {useEffect, useMemo, useRef, useState} from 'react';
import CustomButton from '../CustomButton/CustomButton';
import {Keyboard, ScrollView, TextInput, View} from 'react-native';
import {useLanguage} from '../../utils/LanguageProvider';
import {Option} from '../../utils/FormFields.type';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomAutocomplete.style';
import {CustomAutocompleteType} from './CustomAutocomplete.type';
import {fetchIsraelCities} from '../../services/cities';
import Colors from '../../utils/Colors';

const CustomAutocomplete = (props: CustomAutocompleteType) => {
  const {
    text,
    value,
    options = [],
    autocompleteSource,
    isSmallSize = false,
    isEditable = true,
    onChangeText = () => {},
    onSelect = () => {},
  } = props;

  const {isRTL, t} = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [remoteOptions, setRemoteOptions] = useState<Option[]>(options);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const requestIdRef = useRef(0);
  const inputRef = useRef<TextInput>(null);

  const valueText = value?.toString() || selectedText;

  useEffect(() => {
    setRemoteOptions(options);
  }, [options]);

  useEffect(() => {
    if (autocompleteSource !== 'israelCities' || !isEditable) {
      return;
    }

    const query = valueText.trim();

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      fetchIsraelCities(query)
        .then(cities => {
          if (requestIdRef.current === requestId) {
            setRemoteOptions(cities);
          }
        })
        .catch(() => {
          if (requestIdRef.current === requestId) {
            setRemoteOptions(options);
          }
        })
        .finally(() => {
          if (requestIdRef.current === requestId) {
            setIsLoading(false);
          }
        });
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [autocompleteSource, isEditable, options, valueText]);

  const filteredOptions = useMemo(() => {
    const query = valueText.trim().toLowerCase();
    const activeOptions =
      autocompleteSource === 'israelCities' ? remoteOptions : options;

    if (!query) {
      return activeOptions;
    }

    return activeOptions.filter(option =>
      String(option.label || '')
        .toLowerCase()
        .includes(query),
    );
  }, [autocompleteSource, options, remoteOptions, valueText]);

  const handleSelect = (option: Option) => {
    const selectedLabel = String(option.label || '');

    setSelectedText(selectedLabel);
    onChangeText(selectedLabel);
    onSelect(option);
    setIsOpen(false);
    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  return (
    <View
      style={[
        isSmallSize ? styles.smallContainer : styles.container,
        isRTL ? styles.rowReverse : styles.row,
      ]}>
      <View style={styles.labelWrapper}>
        <CustomText
          text={text}
          customStyle={[
            styles.label,
            isRTL ? styles.textRight : styles.textLeft,
          ]}
        />
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          style={[
            isSmallSize ? styles.smallInput : styles.input,
            styles.baseInput,
            isRTL ? styles.textRight : styles.textLeft,
            !isEditable && styles.readOnlyInput,
          ]}
          editable={isEditable}
          value={valueText}
          placeholder={t('selectPlaceholder')}
          placeholderTextColor={Colors.placeholder}
          onFocus={() => setIsOpen(true)}
          onChangeText={nextValue => {
            setSelectedText(nextValue);
            onChangeText(nextValue);
            setIsOpen(true);
          }}
        />

        {isEditable && isOpen && (
          <View
            style={[
              styles.suggestionsPanel,
              isSmallSize && styles.inlineSuggestionsPanel,
            ]}>
            {isLoading ? (
              <View style={styles.emptyItem}>
                <CustomText
                  text="loading"
                  customStyle={[
                    styles.emptyText,
                    isRTL ? styles.textRight : styles.textLeft,
                  ]}
                />
              </View>
            ) : filteredOptions.length > 0 ? (
              <ScrollView
                style={styles.suggestionsScroll}
                contentContainerStyle={styles.suggestionsScrollContent}
                keyboardShouldPersistTaps="always"
                nestedScrollEnabled
                scrollEnabled
                showsVerticalScrollIndicator>
                {filteredOptions.map(option => (
                  <CustomButton unstyled
                    key={`${option.name}_${option.id}_${option.label}`}
                    onPress={() => handleSelect(option)}
                    style={styles.suggestionItem}>
                    <CustomText
                      text={String(option.label || '')}
                      customStyle={[
                        styles.suggestionText,
                        isRTL ? styles.textRight : styles.textLeft,
                      ]}
                    />
                  </CustomButton>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyItem}>
                <CustomText
                  text="noResults"
                  customStyle={[
                    styles.emptyText,
                    isRTL ? styles.textRight : styles.textLeft,
                  ]}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default CustomAutocomplete;
