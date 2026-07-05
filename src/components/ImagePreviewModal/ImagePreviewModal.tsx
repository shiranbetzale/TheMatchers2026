import React, {useState} from 'react';
import CustomButton from '../CustomButton/CustomButton';
import CustomModal from '../CustomModal/CustomModal';
import {Dimensions, Image, ScrollView, Text, View} from 'react-native';
import {styles} from './ImagePreviewModal.style';
import {useLanguage} from '../../utils/LanguageProvider';
import CloseIcon from '../CloseIcon/CloseIcon';

type ImagePreviewModalProps = {
  images: string[];
  initialIndex?: number;
  visible: boolean;
  onClose: () => void;
};

const {width} = Dimensions.get('window');

const ImagePreviewModal = (props: ImagePreviewModalProps) => {
  const {images, initialIndex = 0, visible, onClose} = props;
  const {t} = useLanguage();
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const handleScroll = ({nativeEvent}: any) => {
    const nextIndex = Math.round(nativeEvent.contentOffset.x / width);
    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  };

  return (
    <CustomModal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <CustomButton
          accessibilityLabel={t('close')}
          variant="icon"
          style={styles.closeButton}
          onPress={onClose}>
          <CloseIcon />
        </CustomButton>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentOffset={{x: width * initialIndex, y: 0}}
          style={styles.slider}>
          {images.map((image, index) => (
            <View key={`${image}_${index}`} style={[styles.slide, {width}]}>
              <Image
                accessible
                accessibilityLabel={`${t('image')} ${index + 1} ${t('of')} ${
                  images.length
                }`}
                source={{uri: image}}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>

        {images.length > 1 && (
          <View accessible={false} style={styles.pagination}>
            {images.map((image, index) => (
              <Text
                key={`${image}_dot_${index}`}
                style={index === activeIndex ? styles.activeDot : styles.dot}>
                •
              </Text>
            ))}
          </View>
        )}
      </View>
    </CustomModal>
  );
};

export default ImagePreviewModal;
