import React from 'react';
import {Share} from 'react-native';
import {Linking, View} from 'react-native';
import PhoneSvg from '../../assets/images/phone.svg';
import {FontsStyle} from '../../utils/FontsStyle';
import CustomButton from '../CustomButton/CustomButton';
import CustomImage from '../CustomImage/CustomImage';
import CustomImageSlider from '../CustomImageSlider/CustomImageSlider';
import CustomText from '../CustomText/CustomText';
import WhiteCard from '../WhiteCard/WhiteCard';
import {styles} from './MatchCard.style';
import {MatchCardType} from './MatchCard.type';
import ShareSvg from '../../assets/images/share.svg';
import {useLanguage} from '../../utils/LanguageProvider';

const MatchCard = (props: MatchCardType) => {
  const {isRTL, t} = useLanguage();
  const {
    city,
    isShowMoreInfo = false,
    matcherPhone,
    isSlide = true,
    isShowMeetingInfo = false,
    isShowInfoButtons = false,
    name,
    age,
    height,
    images,
    status,
    numOfChildren = 0,
    met = false,
    offered = false,
  } = props;

  const details = [
    {
      text: t('matchCard.name'),
      info: name,
      isShow: true,
    },
    {
      text: t('matchCard.ageAndHeight'),
      info: `${height} ,${age}`,
      isShow: true,
    },
    {
      text: t('matchCard.status'),
      info: `${status ? t(status) : ''}${
        numOfChildren > 0 ? ' + ' + numOfChildren : ''
      }`,
      isShow: true,
    },
    {
      text: t('matchCard.city'),
      info: city ? t(city) : '',
      isShow: true,
    },
    {
      text: t('matchCard.worldview'),
      info: t('matchCard.haredi'),
      isShow: isShowMoreInfo,
    },
    {
      text: t('matchCard.met'),
      info: met ? t('yes') : t('no'),
      isShow: isShowMeetingInfo,
    },
    {
      text: t('matchCard.offered'),
      info: offered ? t('yes') : t('no'),
      isShow: isShowMeetingInfo,
    },
    // {
    //   text: "האם נפגשו",
    //   info: met ? "כן" : "לא",
    //   isShow: isShowMeetingInfo,
    // }
  ];

  const file = images[0];
  // const imageUrl = 'data:image/png;base64,' + base64Data;

  const handleShare = () => {
    const shareOptions = {
      title: 'Title',
      message: 'Message to share',
      //url: `data:image/png;base64,${base64}`,
      files: file,
      subject: 'Subject',
    };
    Share.share(shareOptions);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${matcherPhone}`);
  };

  return (
    <WhiteCard customStyle={[styles.container, isRTL ? styles.rtlRow : styles.ltrRow]}>
      <View
        style={[
          styles.imgBtnContainer,
          isRTL ? styles.imgBtnContainerRtl : styles.imgBtnContainerLtr,
        ]}>
        <View style={styles.imgContainer}>
          {images?.length > 1 && isSlide ? (
            <CustomImageSlider images={images} />
          ) : (
            <CustomImage customImgStyle={styles.img} src={images[0]} />
          )}
        </View>
        <View>
          {isShowInfoButtons && (
            <View style={[styles.infoButtons, isRTL ? styles.rtlRow : styles.ltrRow]}>
              <CustomButton
                onPress={() => handleShare()}
                customStyle={styles.icon}>
                <ShareSvg />
              </CustomButton>
              {/* <CustomButton onPress={() => handleSendToWhatsapp()} customStyle={styles.icon} >
              <WhatsappSvg />
            </CustomButton> */}
              <CustomButton
                onPress={() => handleCall()}
                customStyle={styles.icon}>
                <PhoneSvg />
              </CustomButton>
              {/* <CustomButton onPress={() => handleSendEmail()} customStyle={styles.icon} >
              <GmailSvg />
            </CustomButton> */}
            </View>
          )}
        </View>
      </View>
      <View>
        {details.map(infoItem => {
          return (
            infoItem.isShow && (
              <View style={[styles.info, isRTL ? styles.rtlRow : styles.ltrRow]}>
                <CustomText
                  text={`${infoItem.text}: `}
                  customStyle={FontsStyle.subTitle}
                />
                <CustomText
                  text={infoItem.info ?? ''}
                  customStyle={FontsStyle.text}
                />
              </View>
            )
          );
        })}
      </View>
    </WhiteCard>
  );
};

export default MatchCard;
