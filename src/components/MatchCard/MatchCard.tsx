import React, {useMemo, useState} from 'react';
import {Linking, Pressable, Share, View} from 'react-native';
import PhoneSvg from '../../assets/images/phone.svg';
import WhatsappSvg from '../../assets/images/whatsapp.svg';
import EmailSvg from '../../assets/images/email.svg';
import {FontsStyle} from '../../utils/FontsStyle';
import {sendEmail} from '../../utils/generalFunction';
import CustomButton from '../CustomButton/CustomButton';
import CustomImage from '../CustomImage/CustomImage';
import CustomImageSlider from '../CustomImageSlider/CustomImageSlider';
import CustomText from '../CustomText/CustomText';
import ImagePreviewModal from '../ImagePreviewModal/ImagePreviewModal';
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
    isImagePreviewEnabled = false,
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
    meetingStatus,
  } = props;
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const details = useMemo(
    () => [
      {
        text: 'cardAge',
        info: `${age}`,
        isShow: true,
      },
      {
        text: 'cardHeight',
        info: `${height}`,
        isShow: true,
      },
      {
        text: 'cardStatus',
        info: `${status ? t(status) : ''}${
          numOfChildren > 0 ? numOfChildren : ''
        }`,
        isShow: false,
      },
      {
        text: 'cardCity',
        info: city || '',
        isShow: true,
      },
      {
        text: 'cardMatchmaker',
        info: matcherName || matcherPhone,
        isShow: true,
      },
      {
        text: 'cardWorldview',
        info: 'cardHaredi',
        isShow: isShowMoreInfo,
      },
      {
        text: 'cardMet',
        info: met ? 'yes' : 'no',
        isShow: isShowMeetingInfo,
      },
      {
        text: 'cardOffered',
        info: offered ? 'yes' : 'no',
        isShow: isShowMeetingInfo,
      },
      {
        text: 'cardMeetingStatus',
        info:
          meetingStatus === 'busy'
            ? 'busy'
            : meetingStatus === 'available'
              ? 'available'
              : 'notSet',
        isShow: isShowMeetingInfo,
      },
    ],
    [
      age,
      height,
      city,
      matcherName,
      matcherPhone,
      status,
      numOfChildren,
      isShowMoreInfo,
      met,
      offered,
      meetingStatus,
      isShowMeetingInfo,
      t,
    ],
  );

  const profileMessage = [
    `${t('cardName')}: ${name}`,
    `${t('cardAge')}: ${age}`,
    `${t('cardHeight')}: ${height}`,
    `${t('cardStatus')}: ${status ? t(status) : ''}`,
    `${t('cardCity')}: ${city ? t(city) : ''}`,
    `${t('phoneNumber')}: ${phone}`,
    mail ? `${t('email')}: ${mail}` : '',
    images?.[0] ? `${t('image')}: ${images[0]}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const handleShare = () => {
    const shareOptions = {
      title: name,
      message: profileMessage,
      url: images?.[0],
      subject: `${t('candidateDetails')}: ${name}`,
    };
    Share.share(shareOptions);
  };

  const openURL = async (url: string, fallback?: () => void) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        return;
      }
    } catch (error) {
      console.warn('Unable to open URL:', url, error);
    }

    fallback?.();
  };

  const handleCandidateCall = () => {
    if (!phone) {
      return;
    }

    openURL(`tel:${phone}`);
  };

  const handleMatcherCall = () => {
    if (!matcherPhone) {
      return;
    }

    openURL(`tel:${matcherPhone}`);
  };

  const handleWhatsapp = () => {
    if (!matcherPhone) {
      handleShare();
      return;
    }

    const targetPhone = matcherPhone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(profileMessage);
    openURL(
      `whatsapp://send?phone=972${targetPhone.replace(
        /^0/,
        '',
      )}&text=${encodedMessage}`,
      handleShare,
    );
  };

  const handleSendEmail = async () => {
    if (matcherMail) {
      const sent = await sendEmail(
        matcherMail,
        `${t('candidateDetails')}: ${name}`,
        profileMessage,
      );
      if (sent) {
        return;
      }
      handleShare();
    } else {
      handleShare();
    }
  };

  const openImagePreview = () => {
    if (isImagePreviewEnabled && images?.[0]) {
      setPreviewImage(images[0]);
    }
  };

  return (
    <WhiteCard customStyle={styles.container}>
      <View style={[styles.content, isRTL ? styles.rtlRow : styles.ltrRow]}>
        <Pressable
          disabled={!isImagePreviewEnabled}
          onPress={openImagePreview}
          style={[
            styles.imgContainer,
            isRTL ? styles.imgContainerRtl : styles.imgContainerLtr,
          ]}>
          {images?.length > 1 && isSlide ? (
            <CustomImageSlider images={images} />
          ) : (
            <CustomImage customImgStyle={styles.img} src={images?.[0]} />
          )}
        </Pressable>
        <View style={styles.detailsContainer}>
          <View
            style={[
              styles.cardHeader,
              isRTL ? styles.cardHeaderRtl : styles.cardHeaderLtr,
            ]}>
            <CustomText
              text={name}
              customStyle={[
                styles.cardName,
                isRTL ? styles.textRight : styles.textLeft,
              ]}
            />
            <View
              style={[
                styles.statusPill,
                isRTL ? styles.statusPillRtl : styles.statusPillLtr,
              ]}>
              <CustomText
                text={`${status ? t(status) : ''}${
                  numOfChildren > 0 ? numOfChildren : ''
                }`}
                customStyle={styles.statusPillText}
              />
            </View>
          </View>
          {details.map(infoItem => {
            return (
              infoItem.isShow && (
                <View
                  key={infoItem.text}
                  style={[
                    styles.info,
                    isRTL ? styles.rtlRow : styles.ltrRow,
                    isRTL ? styles.infoRtl : styles.infoLtr,
                  ]}>
                  <CustomText
                    text={infoItem.text}
                    customStyle={[
                      FontsStyle.subTitle,
                      isRTL ? styles.textRight : styles.textLeft,
                    ]}
                  />
                  <CustomText
                    text=": "
                    customStyle={[
                      FontsStyle.subTitle,
                      isRTL ? styles.textRight : styles.textLeft,
                    ]}
                  />
                  <CustomText
                    text={infoItem.info ?? ''}
                    customStyle={[
                      FontsStyle.text,
                      isRTL ? styles.textRight : styles.textLeft,
                    ]}
                  />
                </View>
              )
            );
          })}
        </View>
      </View>
      {isShowInfoButtons && (
        <View
          style={[styles.infoButtons, isRTL ? styles.rtlRow : styles.ltrRow]}>
          <View style={styles.actionItem}>
            <CustomButton onPress={handleShare} customStyle={styles.icon}>
              <ShareSvg width={18} height={18} />
            </CustomButton>
            <CustomText text="share" customStyle={styles.actionLabel} />
          </View>
          <View style={styles.actionItem}>
            <CustomButton onPress={handleWhatsapp} customStyle={styles.icon}>
              <WhatsappSvg width={18} height={18} />
            </CustomButton>
            <CustomText text="whatsapp" customStyle={styles.actionLabel} />
          </View>
          <View style={styles.actionItem}>
            <CustomButton
              onPress={handleCandidateCall}
              customStyle={styles.icon}>
              <PhoneSvg width={18} height={18} />
            </CustomButton>
            <CustomText text="candidate" customStyle={styles.actionLabel} />
          </View>
          <View style={styles.actionItem}>
            <CustomButton onPress={handleMatcherCall} customStyle={styles.icon}>
              <PhoneSvg width={18} height={18} />
            </CustomButton>
            <CustomText
              text="cardMatchmaker"
              customStyle={styles.actionLabel}
            />
          </View>
          <View style={styles.actionItem}>
            <CustomButton
              onPress={handleSendEmail}
              customStyle={styles.mailIcon}>
              <EmailSvg width={18} height={18} />
            </CustomButton>
            <CustomText text="email" customStyle={styles.actionLabel} />
          </View>
        </View>
      )}
      <ImagePreviewModal
        images={images || []}
        visible={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
      />
    </WhiteCard>
  );
};

export default MatchCard;
