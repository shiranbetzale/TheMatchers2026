import React from 'react';
import {View} from 'react-native';
import {FontsStyle} from '../../utils/FontsStyle';
import CustomButton from '../CustomButton/CustomButton';
import CustomImage from '../CustomImage/CustomImage';
import CustomText from '../CustomText/CustomText';
import WhiteCard from '../WhiteCard/WhiteCard';
import {styles} from './MatchCard.style';
import {MatchCardType} from './MatchCard.type';

const MatchCard = (props: MatchCardType) => {
  const {name, age, height, image, status, numOfChildren = 0} = props;

  return (
    <WhiteCard customStyle={styles.container}>
      <View style={styles.imgContainer}>
        <CustomImage customImgStyle={styles.img} src={image} />
      </View>
      <View>
        <View style={styles.info}>
          <CustomText text={'שם: '} customStyle={FontsStyle.subTitle} />
          <CustomText text={name} customStyle={FontsStyle.text} />
        </View>
        <View style={styles.info}>
          <CustomText text={'גיל: '} customStyle={FontsStyle.subTitle} />
          <CustomText text={age} customStyle={FontsStyle.text} />
        </View>
        <View style={styles.info}>
          <CustomText text={'גובה: '} customStyle={FontsStyle.subTitle} />
          <CustomText text={height} customStyle={FontsStyle.text} />
        </View>
        <View style={styles.info}>
          <CustomText text={'סטטוס: '} customStyle={FontsStyle.subTitle} />
          <CustomText
            text={`${status}${numOfChildren > 0 ? ' + ' + numOfChildren : ''} `}
            customStyle={FontsStyle.text}
          />
        </View>
      </View>
    </WhiteCard>
  );
};

export default MatchCard;
