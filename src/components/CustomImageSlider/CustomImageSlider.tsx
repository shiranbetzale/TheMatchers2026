import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { styles } from './CustomImageSlider.style';
import { CustomImageSliderType } from './CustomImageSlider.type';
import { Image } from 'react-native';

const CustomImageSlider = (props: CustomImageSliderType) => {
  const { images = [] } = props;
  const width = 100;
  const height = 100;
  const [active, setActive] = useState(0);

  const onScrollChange = ({ nativeEvent }: any) => {
    const slide = Math.ceil(
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
        style={{ width, height }}>
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={{ width, height, resizeMode: "cover" }}
          />
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images.map((i, k) => (
          <Text key={k} style={k == active ? styles.activeDot : styles.dot}>
            •
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default CustomImageSlider;
