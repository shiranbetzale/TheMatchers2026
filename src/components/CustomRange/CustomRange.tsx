import React, {useEffect, useState} from 'react';
import {Pressable, TextInput, useWindowDimensions, View} from 'react-native';
import CustomText from '../CustomText/CustomText';
import { styles } from './CustomRange.style';
import { CustomRangeType } from './CustomRange.type';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {useLanguage} from '../../utils/LanguageProvider';

const CustomRange = (props: CustomRangeType) => {
  const {
    isSmallSize = false,
    text,
    minRange = 0,
    maxRange = 10,
    step = 1,
    value,
    onChange,
  } = props;
  const {isRTL} = useLanguage();
  const {width} = useWindowDimensions();
  const sliderLength = Math.max(
    isSmallSize ? 140 : 190,
    Math.min(width - 140, isSmallSize ? 190 : 250),
  );
  const [rangeValues, setRangeValues] = useState<number[]>(
    value?.length === 2 ? value : [minRange, maxRange],
  );
  const [inputValues, setInputValues] = useState<string[]>(
    (value?.length === 2 ? value : [minRange, maxRange]).map(item =>
      String(item),
    ),
  );

  useEffect(() => {
    if (value?.length === 2) {
      setRangeValues(value);
      setInputValues(value.map(item => String(item)));
    }
  }, [value?.[0], value?.[1]]);

  const handleRangeChange = (values: number[]) => {
    setRangeValues(values);
    setInputValues(values.map(item => String(item)));
    onChange?.(values);
  };

  const clampValue = (nextValue: number, index: 0 | 1) => {
    const steppedValue =
      minRange + Math.round((nextValue - minRange) / step) * step;
    const clampedValue = Math.min(maxRange, Math.max(minRange, steppedValue));

    if (index === 0) {
      return Math.min(clampedValue, rangeValues[1]);
    }

    return Math.max(clampedValue, rangeValues[0]);
  };

  const updateRangeValue = (index: 0 | 1, direction: -1 | 1) => {
    const nextValues = [...rangeValues];
    nextValues[index] = clampValue(nextValues[index] + direction * step, index);
    handleRangeChange(nextValues);
  };

  const updateInputValue = (index: 0 | 1, textValue: string) => {
    const digitsOnly = textValue.replace(/[^\d]/g, '');
    const nextInputValues = [...inputValues];
    nextInputValues[index] = digitsOnly;
    setInputValues(nextInputValues);

    if (!digitsOnly) {
      return;
    }

    const nextNumber = Number(digitsOnly);

    if (!Number.isFinite(nextNumber)) {
      return;
    }

    const nextValues = [...rangeValues];
    nextValues[index] = clampValue(nextNumber, index);
    handleRangeChange(nextValues);
  };

  const commitInputValue = (index: 0 | 1) => {
    if (inputValues[index]) {
      setInputValues(rangeValues.map(item => String(item)));
      return;
    }

    setInputValues(rangeValues.map(item => String(item)));
  };

  const renderStepper = (index: 0 | 1) => {
    const value = rangeValues[index];
    const canDecrease = index === 0 ? value > minRange : value > rangeValues[0];
    const canIncrease = index === 0 ? value < rangeValues[1] : value < maxRange;

    return (
      <View style={styles.stepper}>
        <Pressable
          disabled={!canDecrease}
          onPress={() => updateRangeValue(index, -1)}
          style={[styles.stepButton, !canDecrease && styles.stepButtonDisabled]}>
          <CustomText text="-" customStyle={styles.stepButtonText} />
        </Pressable>
        <TextInput
          value={inputValues[index] ?? String(value)}
          onChangeText={nextValue => updateInputValue(index, nextValue)}
          onBlur={() => commitInputValue(index)}
          keyboardType="number-pad"
          inputMode="numeric"
          selectTextOnFocus
          style={styles.stepValue}
        />
        <Pressable
          disabled={!canIncrease}
          onPress={() => updateRangeValue(index, 1)}
          style={[styles.stepButton, !canIncrease && styles.stepButtonDisabled]}>
          <CustomText text="+" customStyle={styles.stepButtonText} />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={[styles.container, isSmallSize && styles.smallContainer]}>
      <CustomText
        text={text}
        customStyle={[
          styles.label,
          isRTL ? styles.textRight : styles.textLeft,
        ]}
      />
      <View style={styles.rangeContainer}>
        <View style={isSmallSize ? styles.smallRange : styles.range}>
          <MultiSlider
            values={rangeValues}
            sliderLength={sliderLength}
            onValuesChange={handleRangeChange}
            onValuesChangeFinish={handleRangeChange}
            min={minRange}
            max={maxRange}
            step={step}
            allowOverlap
            snapped
            markerStyle={styles.markerStyle}
            pressedMarkerStyle={styles.pressedMarkerStyle}
            selectedStyle={styles.selectedStyle}
          />
        </View>
        <View style={styles.stepperRow}>
          <View
            style={[
              isSmallSize ? styles.smallRangeText : styles.rangeText,
              isSmallSize && styles.left,
            ]}>
            {renderStepper(0)}
          </View>
          <View
            style={[
              isSmallSize ? styles.smallRangeText : styles.rangeText,
              isSmallSize && styles.right,
            ]}>
            {renderStepper(1)}
          </View>
        </View>
      </View>
    </View>
  );
};

export default CustomRange;
