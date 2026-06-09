import React from 'react';
import {View} from 'react-native';
import DatePickerSvg from '../../assets/images/datePicker.svg';
import EditSvg from '../../assets/images/edit.svg';
import {FontsStyle} from '../../utils/FontsStyle';
import CustomButton from '../CustomButton/CustomButton';
import CustomText from '../CustomText/CustomText';
import WhiteCard from '../WhiteCard/WhiteCard';
import {styles} from './SelectedCard.style';
import {SelectedCardType} from './SelectedCard.type';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../MainStackNavigation/MainStackNavigation.type';
import {useLanguage} from '../../utils/LanguageProvider';

const SelectedCard = (props: SelectedCardType) => {
  const {
    card,
    details,
    isShowActions = true,
    isShowMeetingButton = false,
    onMeetingPress,
  } = props;
  const {isRTL} = useLanguage();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const shouldShowMeetingButton = isShowMeetingButton || Boolean(onMeetingPress);

  const handlePress = () => {
    navigation?.navigate('Wizard', {
      mode: 'edit',
      profileId: card.profileId,
      card,
    });
  };

  return (
    <WhiteCard customStyle={[styles.infoContainer, isRTL ? styles.rtlRow : styles.ltrRow]}>
      <View
        style={[
          styles.detailsBlock,
          isRTL ? styles.detailsBlockRtl : styles.detailsBlockLtr,
        ]}>
        {details.map((infoItem, index) => {
          return (
            <View style={[styles.info, isRTL ? styles.rtlRow : styles.ltrRow]} key={index}>
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
                text={infoItem.info}
                customStyle={[
                  FontsStyle.text,
                  isRTL ? styles.textRight : styles.textLeft,
                ]}
              />
            </View>
          );
        })}
      </View>
      {isShowActions && (
        <View style={styles.actions}>
          {shouldShowMeetingButton && (
            <CustomButton
              customStyle={styles.actionButton}
              onPress={() => onMeetingPress?.()}
              icon={<DatePickerSvg width={28} height={28} />}
            />
          )}
          <CustomButton
            customStyle={styles.actionButton}
            onPress={() => handlePress()}
            icon={<EditSvg width={28} height={28} />}
          />
        </View>
      )}
    </WhiteCard>
  );
};

export default SelectedCard;
