import React from 'react';
import {View} from 'react-native';
import MoreInfoSvg from '../../assets/images/moreInfo.svg';
import {FontsStyle} from '../../utils/FontsStyle';
import CustomButton from '../CustomButton/CustomButton';
import CustomImage from '../CustomImage/CustomImage';
import CustomImageSlider from '../CustomImageSlider/CustomImageSlider';
import CustomText from '../CustomText/CustomText';
import {MatchCardType} from '../MatchCard/MatchCard.type';
import WhiteCard from '../WhiteCard/WhiteCard';
import {styles} from './CurrentCard.style';

const CurrentCard = (props: MatchCardType) => {
  const {
    city,
    isSlide = true,
    navigation,
    name,
    age,
    images,
    height,
    status,
    gender,
    numOfChildren,
  } = props;

  const handlePress = () => {
    navigation?.navigate('EditFormScreen');
  };

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

  return (
    <View
      style={[styles.container, gender === 'זכר' ? styles.boy : styles.girl]}>
      <CustomText text={name} customStyle={styles.txt} />
      <View style={styles.imgContainer}>
        {images?.length > 1 && isSlide ? (
          <CustomImageSlider images={images} />
        ) : (
          <CustomImage customImgStyle={styles.img} src={images[0]} />
        )}
      </View>
      <WhiteCard customStyle={styles.infoContainer}>
        <View>
          {details.map(infoItem => {
            return (
              <View style={styles.info}>
                <CustomText
                  text={`${infoItem.text}: `}
                  customStyle={FontsStyle.subTitle}
                />
                <CustomText
                  text={infoItem.info}
                  customStyle={FontsStyle.text}
                />
              </View>
            );
          })}
        </View>
        <View>
          <CustomButton onPress={() => handlePress()} icon={<MoreInfoSvg />} />
        </View>
      </WhiteCard>
    </View>
  );
};

export default CurrentCard;
