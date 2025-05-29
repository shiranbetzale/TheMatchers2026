import React from 'react';
import {Alert, Share} from 'react-native';
import {Linking, View} from 'react-native';
import EmailSvg from '../../assets/images/email.svg';
import PhoneSvg from '../../assets/images/phone.svg';
import WhatsappSvg from '../../assets/images/whatsapp.svg';
import {FontsStyle} from '../../utils/FontsStyle';
import CustomButton from '../CustomButton/CustomButton';
import CustomImage from '../CustomImage/CustomImage';
import CustomImageSlider from '../CustomImageSlider/CustomImageSlider';
import CustomText from '../CustomText/CustomText';
import WhiteCard from '../WhiteCard/WhiteCard';
import {styles} from './MatchCard.style';
import {MatchCardType} from './MatchCard.type';
import ShareSvg from '../../assets/images/share.svg';
import {sendEmail} from '../../utils/generalFunction';

const MatchCard = (props: MatchCardType) => {
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
      text: 'שם',
      info: name,
      isShow: true,
    },
    {
      text: 'גיל וגובה',
      info: `${height} ,${age}`,
      isShow: true,
    },
    {
      text: 'סטטוס',
      info: `${status}${numOfChildren > 0 ? ' + ' + numOfChildren : ''}`,
      isShow: true,
    },
    {
      text: 'עיר מגורים',
      info: city,
      isShow: true,
    },
    {
      text: 'השקפה',
      info: 'חרדי',
      isShow: isShowMoreInfo,
    },
    {
      text: 'האם הוצע',
      info: offered ? 'כן' : 'לא',
      isShow: isShowMeetingInfo,
    },
    // {
    //   text: "האם נפגשו",
    //   info: met ? "כן" : "לא",
    //   isShow: isShowMeetingInfo,
    // }
  ];

  const msg = 'type something';
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

  const handleSendToWhatsapp = () => {
    Linking.openURL(`whatsapp://send?text=${msg}&phone=${matcherPhone}`)
      .then(data => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        Alert.alert('אין לך וואטסאפ במכשיר!');
      });
  };

  const handleCall = () => {
    Linking.openURL(`tel:${matcherPhone}`);
  };

  const handleSendEmail = () => {
    sendEmail(
      'test@gmail.com',
      'Greeting!',
      'I think you are fucked up how many letters you get.',
    ).then(() => {
      console.log('Our email successful provided to device mail ');
    });
  };

  return (
    <WhiteCard customStyle={styles.container}>
      <View style={styles.imgBtnContainer}>
        <View style={styles.imgContainer}>
          {images?.length > 1 && isSlide ? (
            <CustomImageSlider images={images} />
          ) : (
            <CustomImage customImgStyle={styles.img} src={images[0]} />
          )}
        </View>
        <View>
          {isShowInfoButtons && (
            <View style={styles.infoButtons}>
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
                {/* <PhoneSvg /> */}
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
              <View style={styles.info}>
                <CustomText
                  text={infoItem.isShow}
                  customStyle={FontsStyle.text}
                />
                <CustomText
                  text={`${infoItem.text}: `}
                  customStyle={FontsStyle.subTitle}
                />
                <CustomText
                  text={infoItem.info}
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
