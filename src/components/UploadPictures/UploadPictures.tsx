import React, {useState} from 'react';
import {Image, Pressable, View} from 'react-native';
import {
  Asset,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomText from '../../components/CustomText/CustomText';
import ImagePreviewModal from '../ImagePreviewModal/ImagePreviewModal';
import {UploadedPicture, UploadPicturesType} from './UploadPictures.type';
import {styles} from './UploadPictures.style';

const toUploadedPicture = (asset: Asset): UploadedPicture | null => {
  if (!asset.uri) {
    return null;
  }

  return {
    uri: asset.uri,
    fileName: asset.fileName,
    type: asset.type,
    fileSize: asset.fileSize,
  };
};

const pickerOptions: ImageLibraryOptions = {
  mediaType: 'photo',
  selectionLimit: 0,
  quality: 0.8,
};

const UploadPictures = (props: UploadPicturesType) => {
  const {images, maxImages = 6, onChange} = props;
  const [error, setError] = useState('');
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const addImages = (assets: Asset[] = []) => {
    const nextImages = assets
      .map(toUploadedPicture)
      .filter((image): image is UploadedPicture => Boolean(image));

    if (!nextImages.length) {
      return;
    }

    const mergedImages = [...images, ...nextImages].slice(0, maxImages);
    onChange(mergedImages);
    setError('');
  };

  const chooseFromGallery = async () => {
    const response = await launchImageLibrary({
      ...pickerOptions,
      selectionLimit: Math.max(maxImages - images.length, 1),
    });

    if (response.didCancel) {
      return;
    }

    if (response.errorMessage) {
      setError(response.errorMessage);
      return;
    }

    addImages(response.assets);
  };

  const takePhoto = async () => {
    const response = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: false,
    });

    if (response.didCancel) {
      return;
    }

    if (response.errorMessage) {
      setError(response.errorMessage);
      return;
    }

    addImages(response.assets);
  };

  const removeImage = (indexToRemove: number) => {
    onChange(images.filter((_image, index) => index !== indexToRemove));
  };

  const isLimitReached = images.length >= maxImages;
  const previewImages = images.map(image => image.uri);

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        <CustomButton
          text="fromGallery"
          customStyle={styles.actionButton}
          isDisabled={isLimitReached}
          onPress={chooseFromGallery}
        />
        <CustomButton
          text="camera"
          customStyle={styles.actionButton}
          isDisabled={isLimitReached}
          onPress={takePhoto}
        />
      </View>

      {images.length ? (
        <View style={styles.grid}>
          {images.map((image, index) => (
            <View key={`${image.uri}_${index}`} style={styles.tile}>
              <Pressable
                style={styles.previewButton}
                onPress={() => {
                  setPreviewIndex(index);
                  setIsPreviewVisible(true);
                }}>
                <Image source={{uri: image.uri}} style={styles.image} />
              </Pressable>
              <Pressable
                style={styles.removeButton}
                onPress={() => removeImage(index)}>
                <CustomText text="×" customStyle={styles.removeText} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <CustomText
            text="noUploadedImages"
            customStyle={styles.emptyText}
          />
        </View>
      )}

      {error ? <CustomText text={error} customStyle={styles.errorText} /> : null}

      <ImagePreviewModal
        images={previewImages}
        initialIndex={previewIndex}
        visible={isPreviewVisible}
        onClose={() => setIsPreviewVisible(false)}
      />
    </View>
  );
};

export default UploadPictures;
