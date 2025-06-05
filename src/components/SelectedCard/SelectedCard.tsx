import React from 'react';
import {View} from 'react-native';
import MoreInfoSvg from '../../assets/images/moreInfo.svg';
import {FontsStyle} from '../../utils/FontsStyle';
import CustomButton from '../CustomButton/CustomButton';
import CustomText from '../CustomText/CustomText';
import {MatchCardType} from '../MatchCard/MatchCard.type';
import WhiteCard from '../WhiteCard/WhiteCard';
import {styles} from './SelectedCard.style';
import {SelectedCardType} from './SelectedCard.type';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../MainStackNavigation/MainStackNavigation.type';

const SelectedCard = (props: SelectedCardType) => {
  const {details} = props;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation?.navigate('EditFormScreen');
  };

  return (
    <WhiteCard customStyle={styles.infoContainer}>
      <View>
        {details.map((infoItem, index) => {
          return (
            <View style={styles.info} key={index}>
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
