import React from 'react';
import {View} from 'react-native';
import MoreInfoSvg from '../../assets/images/moreInfo.svg';
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
  const {card, details} = props;
  const {isRTL} = useLanguage();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation?.navigate('EditFormScreen', {card});
  };

  return (
    <WhiteCard customStyle={[styles.infoContainer, isRTL ? styles.rtlRow : styles.ltrRow]}>
      <View>
        {details.map((infoItem, index) => {
          return (
            <View style={[styles.info, isRTL ? styles.rtlRow : styles.ltrRow]} key={index}>
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
  );
};

export default SelectedCard;
