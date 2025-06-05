import React, { useState } from 'react';
import { View } from 'react-native';
import CustomText from '../CustomText/CustomText';
import { styles } from './CustomRange.style';
import { CustomRangeType } from './CustomRange.type';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { FontsStyle } from '../../utils/FontsStyle';

const CustomRange = (props: CustomRangeType) => {
  const { isSmallSize = false, text, minRange = 0, maxRange = 10, step = 1 } = props;
  const [rangeValues, setRangeValues] = useState([minRange, maxRange]);

  const handleRangeChange = (values: any) => {
    setRangeValues(values);
  };

  return (
    <View style={!isSmallSize && styles.container}>
      <CustomText text={text} />
      <View style={!isSmallSize && styles.rangeContainer}>
        <View style={[isSmallSize ? styles.smallRangeText : styles.rangeText, isSmallSize && styles.left]}>
          <CustomText text={rangeValues[0]} customStyle={FontsStyle.text} />
        </View>
        <View style={isSmallSize ? styles.smallRange : styles.range}>
          <MultiSlider
            values={rangeValues}
            sliderLength={isSmallSize ? 130 : 160}
            onValuesChange={handleRangeChange}
            min={minRange}
            max={maxRange}
            step={step}
            allowOverlap={false}
            snapped
            markerStyle={styles.markerStyle}
            pressedMarkerStyle={styles.pressedMarkerStyle}
            selectedStyle={styles.selectedStyle}
          />
        </View>
        <View style={[isSmallSize ? styles.smallRangeText : styles.rangeText, isSmallSize && styles.right]}>
          <CustomText text={rangeValues[1]} customStyle={FontsStyle.text} />
        </View>
      </View>
    </View>
  );
};

export default CustomRange;
