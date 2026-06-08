import React, {useState} from 'react';
import {Linking, Pressable, Share, View} from 'react-native';
import EmailSvg from '../../assets/images/email.svg';
import PhoneSvg from '../../assets/images/phone.svg';
import ShareSvg from '../../assets/images/share.svg';
import WhatsappSvg from '../../assets/images/whatsapp.svg';
import CustomImage from '../CustomImage/CustomImage';
import CustomImageSlider from '../CustomImageSlider/CustomImageSlider';
import CustomText from '../CustomText/CustomText';
import ImagePreviewModal from '../ImagePreviewModal/ImagePreviewModal';
import {MatchCardType} from '../MatchCard/MatchCard.type';
import {styles} from './CurrentCard.style';
import SelectedCard from '../SelectedCard/SelectedCard';
import {useLanguage} from '../../utils/LanguageProvider';
import {getCardStatusText} from '../../utils/generalFunction';
import CustomButton from '../CustomButton/CustomButton';

type CurrentCardProps = MatchCardType & {
  onMeetingPress?: () => void;
  isShowMeetingButton?: boolean;
  isShowInfoButtons?: boolean;
};

const cleanLine = (label: string, value?: string | number) => {
  const cleanValue = String(value || '').trim();
  return cleanValue ? `${label}: ${cleanValue}` : '';
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
    isShowInfoButtons = false,
    matcherName,
    matcherPhone,
    matcherMail,
    phone,
    assignedMatchmaker,
    currentUserRole,
    currentUserId,
    tribe,
    hashkafa,
    whatWorks,
    education,
    importantInfo,
    familyInfo,
    matchImportantInfo,
    hobbies,
    matchRangeAges,
  } = props as CurrentCardProps & Record<string, any>;
  const statusInfo = getCardStatusText(status, numOfChildren, t, gender);
  const canSeeCandidatePhone =
    currentUserRole === 'admin' ||
    String(currentUserId || '') === String(assignedMatchmaker || '');

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
      info: statusInfo,
    },
    {
      text: 'cardCityShort',
      info: city || '',
    },
  ].filter(detail => detail.text !== 'cardStatus' || detail.info);

  const isMale = gender === 'male' || gender === t('male');

  const getImage = () => {
    return images?.length > 1 && isSlide ? (
      <CustomImageSlider images={images} />
    ) : (
      <CustomImage customImgStyle={styles.img} src={images[0]} />
    );
  };

  const profileMessage = [
    'בס"ד',
    '',
    '💌 כרטיס שידוכים 💌',
    '',
    cleanLine('😊 שם', name),
    cleanLine('🎂 גיל', age),
    cleanLine('🌱 גובה', height),
    cleanLine('👳 עדה', tribe),
    cleanLine('🎗️ מצב משפחתי', statusInfo),
    cleanLine('🏡 אזור מגורים', city),
    cleanLine('🙏 רמה דתית', hashkafa),
    cleanLine('🔧 מה עושה כרגע בחיים', whatWorks),
    cleanLine('📖 לימודים', education),
    importantInfo ? `🎭 מי אני / תכונות אופי:\n${importantInfo}` : '',
    hobbies ? `🏓 תחביבים:\n${hobbies}` : '',
    matchRangeAges ? `⛔ עד איזה גיל מתפשר/ת:\n${matchRangeAges}` : '',
    familyInfo ? `👪 משפחה:\n${familyInfo}` : '',
    matchImportantInfo ? `💍 מי אני מחפש/ת:\n${matchImportantInfo}` : '',
    '',
    '📞 לפרטים נוספים:',
    cleanLine('שדכנית', matcherName),
    cleanLine('נייד שדכנית', matcherPhone),
    matcherMail ? cleanLine('מייל', matcherMail) : '',
  ]
    .filter(Boolean)
    .join('\n');

  const handleShare = async () => {
    try {
      await Share.share({title: name, message: profileMessage});
    } catch (error) {
      console.warn('Share failed', error);
    }
  };

  const handleWhatsapp = () => {
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(profileMessage)}`).catch(
      handleShare,
    );
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`${t('candidateDetails')}: ${name}`);
    const body = encodeURIComponent(profileMessage);

    Linking.openURL(`mailto:?subject=${subject}&body=${body}`).catch(
      handleShare,
    );
  };

  const handleMatcherCall = () => {
    if (matcherPhone) {
      Linking.openURL(`tel:${matcherPhone}`).catch(error => {
        console.warn('Unable to call matchmaker', error);
      });
    }
  };

  const handleCandidateCall = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`).catch(error => {
        console.warn('Unable to call candidate', error);
      });
    }
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
      {isShowInfoButtons && (
        <View style={styles.infoButtons}>
          <View style={styles.actionItem}>
            <CustomButton onPress={handleMatcherCall} customStyle={styles.icon}>
              <PhoneSvg width={18} height={18} />
            </CustomButton>
            <CustomText text="cardMatchmaker" customStyle={styles.actionLabel} />
          </View>
          {canSeeCandidatePhone && (
            <View style={styles.actionItem}>
              <CustomButton
                onPress={handleCandidateCall}
                customStyle={styles.icon}>
                <PhoneSvg width={18} height={18} />
              </CustomButton>
              <CustomText text="candidate" customStyle={styles.actionLabel} />
            </View>
          )}
          <View style={styles.actionItem}>
            <CustomButton onPress={handleWhatsapp} customStyle={styles.icon}>
              <WhatsappSvg width={18} height={18} />
            </CustomButton>
            <CustomText text="whatsapp" customStyle={styles.actionLabel} />
          </View>
          <View style={styles.actionItem}>
            <CustomButton onPress={handleSendEmail} customStyle={styles.icon}>
              <EmailSvg width={18} height={18} />
            </CustomButton>
            <CustomText text="email" customStyle={styles.actionLabel} />
          </View>
          <View style={styles.actionItem}>
            <CustomButton onPress={handleShare} customStyle={styles.icon}>
              <ShareSvg width={18} height={18} />
            </CustomButton>
            <CustomText text="share" customStyle={styles.actionLabel} />
          </View>
        </View>
      )}
      <ImagePreviewModal
        images={images}
        visible={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </View>
  );
};

export default CurrentCard;
