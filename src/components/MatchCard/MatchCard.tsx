import React from 'react';
import {Linking, Share, View} from 'react-native';
import PhoneSvg from '../../assets/images/phone.svg';
import WhatsappSvg from '../../assets/images/whatsapp.svg';
import {FontsStyle} from '../../utils/FontsStyle';
import {sendEmail} from '../../utils/generalFunction';
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
    matcherMail,
    matcherName,
    phone,
    mail,
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
      text: 'שדכנית',
      info: matcherName || matcherPhone,
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

  const profileMessage = [
    `${t('matchCard.name')}: ${name}`,
    `${t('matchCard.age')}: ${age}`,
    `${t('matchCard.height')}: ${height}`,
    `${t('matchCard.status')}: ${status ? t(status) : ''}`,
    `${t('matchCard.city')}: ${city ? t(city) : ''}`,
    `${t('phoneNumber')}: ${phone}`,
    mail ? `${t('email')}: ${mail}` : '',
    images?.[0] ? `תמונה: ${images[0]}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const handleShare = () => {
    const shareOptions = {
      title: name,
      message: profileMessage,
      url: images?.[0],
      subject: `פרטי משודך/ת: ${name}`,
    };
    Share.share(shareOptions);
  };

  const handleCandidateCall = () => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleMatcherCall = () => {
    Linking.openURL(`tel:${matcherPhone}`);
  };

  const handleWhatsapp = () => {
    const targetPhone = matcherPhone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(profileMessage);
    Linking.openURL(
      `whatsapp://send?phone=972${targetPhone.replace(
        /^0/,
        '',
      )}&text=${encodedMessage}`,
    );
  };

  const handleSendEmail = () => {
    if (matcherMail) {
      sendEmail(matcherMail, `פרטי משודך/ת: ${name}`, profileMessage);
    } else {
      handleShare();
    }
  };

  return (
    <WhiteCard
      customStyle={[styles.container, isRTL ? styles.rtlRow : styles.ltrRow]}>
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
            <View
              style={[
                styles.infoButtons,
                isRTL ? styles.rtlRow : styles.ltrRow,
              ]}>
              <CustomButton
                onPress={() => handleShare()}
                customStyle={styles.icon}>
                <ShareSvg />
              </CustomButton>
              <CustomButton onPress={handleWhatsapp} customStyle={styles.icon}>
                <WhatsappSvg />
              </CustomButton>
              <CustomButton
                onPress={() => handleCandidateCall()}
                customStyle={styles.icon}>
                <PhoneSvg />
              </CustomButton>
              <CustomButton
                onPress={() => handleMatcherCall()}
                customStyle={styles.icon}>
                <PhoneSvg />
              </CustomButton>
              <CustomButton
                onPress={handleSendEmail}
                customStyle={styles.mailIcon}>
                <CustomText text="@" customStyle={styles.mailIconText} />
              </CustomButton>
            </View>
          )}
        </View>
      </View>
      <View>
        {details.map(infoItem => {
          return (
            infoItem.isShow && (
              <View
                key={infoItem.text}
                style={[styles.info, isRTL ? styles.rtlRow : styles.ltrRow]}>
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
