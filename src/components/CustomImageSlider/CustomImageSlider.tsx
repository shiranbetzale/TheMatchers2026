import React, {useState} from 'react';
import {
  Image,
  LayoutChangeEvent,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {styles} from './CustomImageSlider.style';
import {CustomImageSliderType} from './CustomImageSlider.type';
import {useLanguage} from '../../utils/LanguageProvider';
import {HIGH_QUALITY_IMAGE_PROPS} from '../CustomImage/CustomImage';

const CustomImageSlider = (props: CustomImageSliderType) => {
  const {images = []} = props;
  const {t} = useLanguage();
  const normalizedImages = images.filter(
    image => typeof image === 'string' && image.trim().length > 0,
  );
  const [viewport, setViewport] = useState({width: 1, height: 1});
  const [active, setActive] = useState(0);

  const onScrollChange = ({nativeEvent}: any) => {
    const slide = Math.round(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== active) {
      setActive(slide);
    }
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setViewport({width, height});
    }
  };

  return (
    <SafeAreaView style={styles.container} onLayout={handleLayout}>
      <ScrollView
        pagingEnabled
        horizontal
        onScroll={onScrollChange}
        showsHorizontalScrollIndicator={false}
        style={styles.slider}>
        {normalizedImages.map((image, index) => (
          <Image
            {...HIGH_QUALITY_IMAGE_PROPS}
            accessible
            accessibilityLabel={`${t('image')} ${index + 1} ${t('of')} ${
              normalizedImages.length
            }`}
            key={`${image}_${index}`}
            source={{uri: image}}
            style={[
              styles.slideImage,
              {width: viewport.width, height: viewport.height},
            ]}
            onError={() => {}}
          />
        ))}
      </ScrollView>
      <View accessible={false} style={styles.pagination}>
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
