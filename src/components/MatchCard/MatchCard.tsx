import React, {useMemo, useState} from 'react';
import {Linking, Pressable, Share, View} from 'react-native';
import PhoneSvg from '../../assets/images/phone.svg';
import WhatsappSvg from '../../assets/images/whatsapp.svg';
import EmailSvg from '../../assets/images/email.svg';
import ShareSvg from '../../assets/images/share.svg';

import {FontsStyle} from '../../utils/FontsStyle';
import {
  getCardStatusText,
  getDefaultProfileImage,
} from '../../utils/generalFunction';
import CustomButton from '../CustomButton/CustomButton';
import CustomImage from '../CustomImage/CustomImage';
import CustomImageSlider from '../CustomImageSlider/CustomImageSlider';
import CustomText from '../CustomText/CustomText';
import ImagePreviewModal from '../ImagePreviewModal/ImagePreviewModal';
import WhiteCard from '../WhiteCard/WhiteCard';
import CustomSingleCheckBox from '../CustomCheckBox/CustomSingleCheckBox';
import {styles} from './MatchCard.style';
import {MatchCardType} from './MatchCard.type';
import {useLanguage} from '../../utils/LanguageProvider';
import {formatProfileOptionValue} from '../../utils/shareFormatting';

const cleanLine = (label: string, value?: string | number) => {
  const cleanValue = String(value || '').trim();
  return cleanValue ? `${label}: ${cleanValue}` : '';
};

const formatMoney = (value?: string | number) => {
  const cleanValue = String(value || '').replace(/[^\d]/g, '');

  if (!cleanValue) {
    return '';
  }

  return Number(cleanValue).toLocaleString('he-IL');
};

const getCardImages = (card: MatchCardType) => {
  const normalizedImages = Array.isArray(card.images)
    ? card.images.filter(image => typeof image === 'string' && image.trim())
    : [];

  return normalizedImages.length
    ? normalizedImages
    : [getDefaultProfileImage(card.gender)];
};

const isShareableImageUri = (image: string) =>
  /^https?:\/\//i.test(image) || /^data:image\//i.test(image);

const MatchCard = (props: MatchCardType) => {
  const {isRTL, t} = useLanguage();

  const {
    city,
    isShowMoreInfo = false,
    matcherPhone,
    matcherMail,
    matcherName,
    phone,
    isSlide = true,
    isImagePreviewEnabled = false,
    isShowMeetingInfo = false,
    isShowInfoButtons = false,
    name,
    age,
    height,
    images,
    status,
    gender,
    numOfChildren = 0,
    met = false,
    offered = false,
    meetingStatus,
    currentUserRole,
    currentUserId,
    assignedMatchmaker,
    pairedCard,

    // שדות נוספים לכרטיס שידוכים
    tribe,
    hashkafa,
    whatWorks,
    education,
    importantInfo,
    familyInfo,
    matchImportantInfo,
    hobbies,
    matchRangeAges,
  } = props as MatchCardType & Record<string, any>;

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [shareWithoutImages, setShareWithoutImages] = useState(false);
  const displayImages = useMemo(() => {
    return getCardImages(props);
  }, [gender, images]);

  const statusPillText = getCardStatusText(status, numOfChildren, t, gender);

  const isCardMatchmaker =
    currentUserRole === 'admin' ||
    String(currentUserId) === String(assignedMatchmaker);

  const canSeeCandidatePhone = isCardMatchmaker;

  const details = useMemo(
    () => [
      {text: 'cardAge', info: `${age || ''}`, isShow: true},
      {text: 'cardHeight', info: `${height || ''}`, isShow: true},
      {text: 'cardCity', info: city || '', isShow: true},
      {
        text: 'cardMatchmaker',
        info: matcherName || matcherPhone || '',
        isShow: true,
      },
      {
        text: 'cardWorldview',
        info: hashkafa || 'cardHaredi',
        isShow: isShowMoreInfo,
      },
      {text: 'cardMet', info: met ? 'yes' : 'no', isShow: isShowMeetingInfo},
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
      hashkafa,
      isShowMoreInfo,
      met,
      offered,
      meetingStatus,
      isShowMeetingInfo,
    ],
  );

  const buildShareSection = (
    title: string,
    card: MatchCardType & Record<string, any>,
    includeImages = true,
  ) => {
    const cardImages = getCardImages(card);
    const shareableImages = cardImages.filter(isShareableImageUri);
    const cardStatus = getCardStatusText(
      card.status,
      card.numOfChildren || 0,
      t,
      card.gender,
    );

    return [
      title,
      cleanLine('😊 שם', card.name),
      cleanLine('🎂 גיל', card.age),
      cleanLine('🌱 גובה', card.height),
      cleanLine('👳 עדה', card.tribe),
      cleanLine('🎗️ מצב משפחתי', cardStatus),
      cleanLine('🏡 אזור מגורים', card.city),
      cleanLine(
        '🙏 רמה דתית',
        formatProfileOptionValue('hashkafa', card.hashkafa, card.gender),
      ),
      cleanLine(
        '🔧 מה עושה כרגע בחיים',
        formatProfileOptionValue('whatWorks', card.whatWorks, card.gender),
      ),
      cleanLine(
        '📖 לימודים',
        formatProfileOptionValue('education', card.education, card.gender),
      ),
      card.importantInfo ? `🎭 קצת עלי:\n${card.importantInfo}` : '',
      card.hobbies ? `🏓 תחביבים:\n${card.hobbies}` : '',
      card.matchRangeAges
        ? `⛔ עד איזה גיל מתפשר/ת:\n${card.matchRangeAges}`
        : '',
      cleanLine('💰 כמה ההורים עוזרים', formatMoney(card.helpWithMoney)),
      card.helpWithMoneyDetails
        ? `🤝 במה עוד ההורים עוזרים:\n${card.helpWithMoneyDetails}`
        : '',
      card.familyInfo ? `👪 משפחה:\n${card.familyInfo}` : '',
      card.matchImportantInfo
        ? `💍 מי אני מחפש/ת:\n${card.matchImportantInfo}`
        : '',
      includeImages
        ? shareableImages.length
          ? `🖼️ תמונות:\n${shareableImages.join('\n')}`
          : cardImages.length
            ? '🖼️ תמונות קיימות בכרטיס, אבל אינן קישור ציבורי. צריך לשלוח אותן בנפרד.'
            : ''
        : '',
    ].filter(Boolean);
  };

  const profileMessage = useMemo(() => {
    const matchCard = props as MatchCardType & Record<string, any>;
    const candidateCard = pairedCard as
      | (MatchCardType & Record<string, any>)
      | undefined;

    return [
      'בס"ד',
      '',
      candidateCard ? '💌 הצעת התאמה 💌' : '💌 כרטיס שידוכים 💌',
      '',
      ...(candidateCard
        ? [
            ...buildShareSection(
              'המשודך/ת:',
              candidateCard,
              !shareWithoutImages,
            ),
            '',
            ...buildShareSection(
              'ההתאמה:',
              matchCard,
              !shareWithoutImages,
            ),
          ]
        : buildShareSection('', matchCard, !shareWithoutImages)),
      '',
      '📞 לפרטים נוספים:',
      cleanLine('שדכנית', matcherName),
      cleanLine('נייד שדכנית', matcherPhone),
      matcherMail ? cleanLine('מייל', matcherMail) : '',
    ]
      .filter(Boolean)
      .join('\n');
  }, [
    matcherMail,
    matcherName,
    matcherPhone,
    pairedCard,
    props,
    shareWithoutImages,
    t,
  ]);

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
    if (phone) {
      openURL(`tel:${phone}`);
    }
  };

  const handleMatcherCall = () => {
    if (matcherPhone) {
      openURL(`tel:${matcherPhone}`);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: name,
        message: profileMessage,
      });
    } catch (error) {
      console.warn('Share failed', error);
    }
  };

  const handleWhatsapp = () => {
    openURL(
      `whatsapp://send?text=${encodeURIComponent(profileMessage)}`,
      handleShare,
    );
  };

  const handleSendEmail = () => {
    const recipient = String(matcherMail || '').trim();
    const subject = encodeURIComponent(`${t('candidateDetails')}: ${name}`);
    const body = encodeURIComponent(profileMessage);

    openURL(`mailto:${recipient}?subject=${subject}&body=${body}`, handleShare);
  };

  const openImagePreview = () => {
    if (isImagePreviewEnabled && displayImages?.[0]) {
      setPreviewImage(displayImages[0]);
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
          {displayImages.length > 1 && isSlide ? (
            <CustomImageSlider images={displayImages} />
          ) : (
            <CustomImage customImgStyle={styles.img} src={displayImages[0]} />
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

            {statusPillText ? (
              <View
                style={[
                  styles.statusPill,
                  isRTL ? styles.statusPillRtl : styles.statusPillLtr,
                ]}>
                <CustomText
                  text={statusPillText}
                  customStyle={styles.statusPillText}
                />
              </View>
            ) : null}
          </View>

          {details.map(
            infoItem =>
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
                  <CustomText text=": " customStyle={FontsStyle.subTitle} />
                  <CustomText
                    text={infoItem.info ?? ''}
                    customStyle={[
                      FontsStyle.text,
                      isRTL ? styles.textRight : styles.textLeft,
                    ]}
                  />
                </View>
              ),
          )}
        </View>
      </View>

      {isShowInfoButtons && (
        <>
          <View
            style={[
              styles.shareOptions,
              isRTL ? styles.shareOptionsRtl : styles.shareOptionsLtr,
            ]}>
            <View
              style={[
                styles.shareOptionRow,
                isRTL ? styles.rtlRow : styles.ltrRow,
              ]}>
              <CustomSingleCheckBox
                id={1}
                name="shareWithoutImages"
                label="shareWithoutImages"
                isSelected={shareWithoutImages}
                isRTL={isRTL}
                isSmallSize
                onChange={(_option, nextValue) =>
                  setShareWithoutImages(nextValue)
                }
              />
            </View>
          </View>

          <View
            style={[styles.infoButtons, isRTL ? styles.rtlRow : styles.ltrRow]}>
            <View style={styles.actionItem}>
              <CustomButton
                onPress={handleMatcherCall}
                customStyle={styles.icon}>
                <PhoneSvg width={18} height={18} />
              </CustomButton>
              <CustomText
                text="cardMatchmaker"
                customStyle={styles.actionLabel}
              />
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
              <CustomButton
                onPress={handleSendEmail}
                customStyle={styles.mailIcon}>
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
        </>
      )}

      <ImagePreviewModal
        images={displayImages}
        visible={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
      />
    </WhiteCard>
  );
};

export default MatchCard;
