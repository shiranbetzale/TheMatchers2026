import React from 'react';
import {View} from 'react-native';
import {FontsStyle} from '../../utils/FontsStyle';
import CustomImage from '../CustomImage/CustomImage';
import CustomText from '../CustomText/CustomText';
import {MatchCardType} from '../MatchCard/MatchCard.type';
import WhiteCard from '../WhiteCard/WhiteCard';
import {styles} from './CurrentCard.style';

const CurrentCard = (props: MatchCardType) => {
  const {name, age, image, height, status, gender, numOfChildren} = props;

  return (
    <View
      style={[styles.container, gender === 'זכר' ? styles.boy : styles.girl]}>
      <CustomText text={name} customTxtStyle={FontsStyle.title} />
      <View style={styles.imgContainer}>
        <CustomImage customImgStyle={styles.img} src={image} />
      </View>
      <WhiteCard customStyle={styles.infoContainer}>
        <View style={styles.info}>
          <CustomText text={'גיל: '} customTxtStyle={FontsStyle.subTitle} />
          <CustomText text={age} customTxtStyle={FontsStyle.text} />
        </View>
        <View style={styles.info}>
          <CustomText text={'גובה: '} customTxtStyle={FontsStyle.subTitle} />
          <CustomText text={height} customTxtStyle={FontsStyle.text} />
        </View>
        <View style={styles.info}>
          <CustomText text={'סטטוס: '} customTxtStyle={FontsStyle.subTitle} />
          <CustomText
            text={`${status}${numOfChildren > 0 ? ' + ' + numOfChildren : ''}`}
            customTxtStyle={FontsStyle.text}
          />
        </View>
      </WhiteCard>
    </View>
  );
};

export default CurrentCard;
