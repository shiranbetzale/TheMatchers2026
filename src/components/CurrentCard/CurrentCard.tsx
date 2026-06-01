import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import CustomImage from '../CustomImage/CustomImage';
import CustomImageSlider from '../CustomImageSlider/CustomImageSlider';
import CustomText from '../CustomText/CustomText';
import ImagePreviewModal from '../ImagePreviewModal/ImagePreviewModal';
import {MatchCardType} from '../MatchCard/MatchCard.type';
import {styles} from './CurrentCard.style';
import SelectedCard from '../SelectedCard/SelectedCard';
import {useLanguage} from '../../utils/LanguageProvider';

type CurrentCardProps = MatchCardType & {
  onMeetingPress?: () => void;
  isShowMeetingButton?: boolean;
};

const CurrentCard = (props: CurrentCardProps) => {
  const {t} = useLanguage();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const {
    city,
    isSlide = true,
    name,
    age,
    images,
    height,
    status,
    gender,
    numOfChildren,
    onMeetingPress,
    isShowMeetingButton,
  } = props;

  const details = [
    {
      text: 'cardAge',
      info: age,
    },
    {
      text: 'cardHeight',
      info: height,
    },
    {
      text: 'cardStatus',
      info: `${status ? t(status) : ''}${
        numOfChildren > 0 ? numOfChildren : ''
      }`,
    },
    {
      text: 'cardCityShort',
      info: city || '',
    },
  ];

  const isMale = gender === 'male' || gender === t('male');

  const getImage = () => {
    return images?.length > 1 && isSlide ? (
      <CustomImageSlider images={images} />
    ) : (
      <CustomImage customImgStyle={styles.img} src={images[0]} />
    );
  };

  return (
    <View style={[styles.container, isMale ? styles.boy : styles.girl]}>
      <CustomText text={name} customStyle={styles.txt} />
      <Pressable
        style={styles.imgContainer}
        onPress={() => setIsPreviewOpen(true)}>
        {getImage()}
      </Pressable>
      <SelectedCard
        card={props}
        details={details}
        isShowMeetingButton={isShowMeetingButton}
        onMeetingPress={onMeetingPress}
      />
      <ImagePreviewModal
        images={images}
        visible={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </View>
  );
};

export default CurrentCard;
