import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {styles} from './ImagePreviewModal.style';

type ImagePreviewModalProps = {
  images: string[];
  initialIndex?: number;
  visible: boolean;
  onClose: () => void;
};

const {width} = Dimensions.get('window');

const ImagePreviewModal = (props: ImagePreviewModalProps) => {
  const {images, initialIndex = 0, visible, onClose} = props;
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const handleScroll = ({nativeEvent}: any) => {
    const nextIndex = Math.round(nativeEvent.contentOffset.x / width);
    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>

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
                source={{uri: image}}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>

        {images.length > 1 && (
          <View style={styles.pagination}>
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
    </Modal>
  );
};

export default ImagePreviewModal;
