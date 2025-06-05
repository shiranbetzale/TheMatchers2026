import React from 'react';
import {View} from 'react-native';
import CustomImage from '../CustomImage/CustomImage';
import CustomImageSlider from '../CustomImageSlider/CustomImageSlider';
import CustomText from '../CustomText/CustomText';
import {MatchCardType} from '../MatchCard/MatchCard.type';
import {styles} from './CurrentCard.style';
import SelectedCard from '../SelectedCard/SelectedCard';

const CurrentCard = (props: MatchCardType) => {
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
      text: 'גיל',
      info: age,
    },
    {
      text: 'גובה',
      info: height,
    },
    {
      text: 'סטטוס',
      info: `${status}${numOfChildren > 0 ? ' + ' + numOfChildren : ''}`,
    },
    {
      text: 'עיר',
      info: city,
    },
  ];

  const getImage = () => {
    return images?.length > 1 && isSlide ? (
      <CustomImageSlider images={images} />
    ) : (
      <CustomImage customImgStyle={styles.img} src={images[0]} />
    );
  };

  return (
    <View
      style={[styles.container, gender === 'זכר' ? styles.boy : styles.girl]}>
      <CustomText text={name} customStyle={styles.txt} />
      <View style={styles.imgContainer}>{getImage()}</View>
      <SelectedCard details={details} />
    </View>
  );
};

export default CurrentCard;
