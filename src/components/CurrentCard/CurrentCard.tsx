import React from 'react';
import {View} from 'react-native';
import CustomImage from '../CustomImage/CustomImage';
import CustomImageSlider from '../CustomImageSlider/CustomImageSlider';
import CustomText from '../CustomText/CustomText';
import {MatchCardType} from '../MatchCard/MatchCard.type';
import {styles} from './CurrentCard.style';
import SelectedCard from '../SelectedCard/SelectedCard';
import {useLanguage} from '../../utils/LanguageProvider';

const CurrentCard = (props: MatchCardType) => {
  const {t} = useLanguage();
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
  } = props;

  const details = [
    {
      text: t('matchCard.age'),
      info: age,
    },
    {
      text: t('matchCard.height'),
      info: height,
    },
    {
      text: t('matchCard.status'),
      info: `${status ? t(status) : ''}${
        numOfChildren > 0 ? ' + ' + numOfChildren : ''
      }`,
    },
    {
      text: t('matchCard.cityShort'),
      info: city ? t(city) : '',
    },
  ];

  const isMale = gender === 'זכר' || gender === 'male' || gender === t('male');

  const getImage = () => {
    return images?.length > 1 && isSlide ? (
      <CustomImageSlider images={images} />
    ) : (
      <CustomImage customImgStyle={styles.img} src={images[0]} />
    );
  };

  return (
    <View
      style={[styles.container, isMale ? styles.boy : styles.girl]}>
      <CustomText text={name} customStyle={styles.txt} />
      <View style={styles.imgContainer}>{getImage()}</View>
      <SelectedCard details={details} />
    </View>
  );
};

export default CurrentCard;
