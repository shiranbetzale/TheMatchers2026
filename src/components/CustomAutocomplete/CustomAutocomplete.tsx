import React, {useEffect, useMemo, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {useLanguage} from '../../utils/LanguageProvider';
import CustomText from '../CustomText/CustomText';
import {styles} from './CustomAutocomplete.style';
import {CustomAutocompleteType} from './CustomAutocomplete.type';
import {fetchIsraelCities} from '../../services/cities';

const CustomAutocomplete = (props: CustomAutocompleteType) => {
  const {
    text,
    value,
    options,
    autocompleteSource,
    isSmallSize = false,
    isEditable = true,
    onChangeText = () => {},
    onSelect = () => {},
  } = props;
  const {isRTL, t} = useLanguage();
  const [isFocused, setIsFocused] = useState(false);
  const [remoteOptions, setRemoteOptions] = useState(options);
  const valueText = value?.toString() || '';
  const activeOptions =
    autocompleteSource === 'israelCities' && remoteOptions.length
      ? remoteOptions
      : options;

  useEffect(() => {
    setRemoteOptions(options);
  }, [options]);

  useEffect(() => {
    if (autocompleteSource !== 'israelCities' || !isEditable) {
      return;
    }

    const normalizedValue = valueText.trim();

    if (normalizedValue.length < 2) {
      setRemoteOptions(options);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchIsraelCities(normalizedValue)
        .then(cities => {
          if (cities.length) {
            setRemoteOptions(cities);
          }
        })
        .catch(() => {
          setRemoteOptions(options);
        });
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [autocompleteSource, isEditable, options, valueText]);

  const filteredOptions = useMemo(() => {
    const normalizedValue = valueText.trim().toLowerCase();

    if (!normalizedValue) {
      return activeOptions;
    }

    return activeOptions.filter(option =>
      option.label.toLowerCase().includes(normalizedValue),
    );
  }, [activeOptions, valueText]);

  const handleSelect = (option: (typeof options)[number]) => {
    onChangeText(option.label);
    onSelect(option);
    setIsFocused(false);
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
      <TextInput
        style={[
          isSmallSize ? styles.smallInput : styles.input,
          styles.baseInput,
          isRTL ? styles.textRight : styles.textLeft,
          !isEditable && styles.readOnlyInput,
        ]}
        editable={isEditable}
        value={valueText}
        placeholder={t('selectPlaceholder')}
        placeholderTextColor="#A8ADB7"
        onFocus={() => setIsFocused(true)}
        onChangeText={nextValue => {
          onChangeText(nextValue);
          setIsFocused(true);
        }}
      />
      {isEditable && isFocused && (
        <View
          style={[
            styles.suggestionsPanel,
            isSmallSize ? styles.smallSuggestionsPanel : styles.wideSuggestionsPanel,
            isRTL ? styles.suggestionsRtl : styles.suggestionsLtr,
          ]}>
          {filteredOptions.slice(0, 6).map(option => (
            <TouchableOpacity
              key={`${option.name}_${option.id}`}
              activeOpacity={0.82}
              onPress={() => handleSelect(option)}
              style={styles.suggestionItem}>
              <CustomText
                text={option.label}
                customStyle={[
                  styles.suggestionText,
                  isRTL ? styles.textRight : styles.textLeft,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default CustomAutocomplete;
