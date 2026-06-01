import React, {useState} from 'react';
import {Image, SafeAreaView, ScrollView, Text, View} from 'react-native';
import {styles} from './CustomImageSlider.style';
import {CustomImageSliderType} from './CustomImageSlider.type';

const CustomImageSlider = (props: CustomImageSliderType) => {
  const {images = []} = props;
  const normalizedImages = images.filter(
    image => typeof image === 'string' && image.trim().length > 0,
  );
  const width = 100;
  const height = 100;
  const [active, setActive] = useState(0);

  const onScrollChange = ({nativeEvent}: any) => {
    const slide = Math.round(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== active) {
      setActive(slide);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView
        pagingEnabled
        horizontal
        onScroll={onScrollChange}
        showsHorizontalScrollIndicator={false}
        style={{width, height}}>
        {normalizedImages.map((image, index) => (
          <Image
            key={`${image}_${index}`}
            source={{uri: image}}
            style={[styles.slideImage, {width, height}]}
            onError={() => {}}
          />
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {normalizedImages.map((i, k) => (
          <Text key={k} style={k === active ? styles.activeDot : styles.dot}>
            •
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default CustomImageSlider;
