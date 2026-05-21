import React, {useState} from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import CustomButton from '../../components/CustomButton/CustomButton';
import CustomFilter from '../../components/CustomFilter/CustomFilter';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import CustomImage from '../../components/CustomImage/CustomImage';
import CustomOrderBy from '../../components/CustomOrderBy/CustomOrderBy';
import CustomText from '../../components/CustomText/CustomText';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import FilterSvg from '../../assets/images/filter.svg';
import OrderBySvg from '../../assets/images/orderBy.svg';
import Colors from '../../utils/Colors';
import HomeScreen from '../HomeScreen/HomeScreen';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {useLanguage} from '../../utils/LanguageProvider';
import {styles} from './AdminAllCardsScreen.style';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const AdminAllCardsScreen = () => {
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [isShowOrderBy, setIsShowOrderBy] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const {isRTL, t} = useLanguage();

  const allCardsArray: MatchCardType[] = [
    {
      city: 'bnei Brak',
      matcherMail: 'matchmaker1@example.com',
      mail: 'candidate1@example.com',
      phone: '0521111111',
      matcherPhone: '0549450954',
      matcherName: 'שירן בצלאל',
      name: 'David Levi',
      offered: true,
      met: false,
      gender: 'male',
      age: 29,
      height: '1.78',
      status: 'single',
      numOfChildren: 0,
      isShowInfoButtons: true,
      isShowMeetingInfo: true,
      images: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
      ],
    },
    {
      city: 'jerusalem',
      matcherMail: 'matchmaker2@example.com',
      mail: 'candidate2@example.com',
      phone: '0522222222',
      matcherPhone: '0549450954',
      matcherName: 'שירן בצלאל',
      name: 'Miriam Cohen',
      offered: false,
      met: false,
      gender: 'female',
      age: 27,
      height: '1.66',
      status: 'single',
      numOfChildren: 0,
      isShowInfoButtons: true,
      isShowMeetingInfo: true,
      images: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
      ],
    },
    {
      city: 'telAviv',
      matcherMail: 'matchmaker3@example.com',
      mail: 'candidate3@example.com',
      phone: '0523333333',
      matcherPhone: '0549450954',
      matcherName: 'שירן בצלאל',
      name: 'Yosef Friedman',
      offered: true,
      met: true,
      gender: 'male',
      age: 36,
      height: '1.82',
      status: 'divorced',
      numOfChildren: 2,
      isShowInfoButtons: true,
      isShowMeetingInfo: true,
      images: [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
      ],
    },
    {
      city: 'haifa',
      matcherMail: 'matchmaker4@example.com',
      mail: 'candidate4@example.com',
      phone: '0524444444',
      matcherPhone: '0549450954',
      matcherName: 'שירן בצלאל',
      name: 'Rachel Stern',
      offered: false,
      met: true,
      gender: 'female',
      age: 34,
      height: '1.70',
      status: 'widower',
      numOfChildren: 1,
      isShowInfoButtons: true,
      isShowMeetingInfo: true,
      images: [
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=80',
      ],
    },
  ];

  const toggleFilter = () => {
    setIsShowOrderBy(false);
    setIsShowFilter(prev => !prev);
  };

  const toggleOrderBy = () => {
    setIsShowFilter(false);
    setIsShowOrderBy(prev => !prev);
  };

  const closeMenus = () => {
    setIsShowFilter(false);
    setIsShowOrderBy(false);
  };

  const headerBtns = [
    {comp: <FilterSvg />, onPress: toggleFilter},
    {comp: <OrderBySvg />, onPress: toggleOrderBy},
  ];

  return (
    <HomeScreen
      pinChildren={
        <View style={styles.pinChildrenContainer}>
          <CustomHeader headerBtns={headerBtns} />
          {isShowFilter && (
            <CustomFilter onApply={closeMenus} onReset={closeMenus} />
          )}
          {isShowOrderBy && (
            <CustomOrderBy onApply={closeMenus} onReset={closeMenus} />
          )}
        </View>
      }>
      {allCardsArray.map((matchItem, index) => {
        const cardColor =
          matchItem.gender === 'male' ? Colors.lightBlue : Colors.pink;

        return (
          <View
            key={index}
            style={[
              styles.listCard(cardColor),
              isRTL ? styles.rowReverse : styles.row,
            ]}>
            <View style={styles.avatarContainer}>
              <CustomImage
                customImgStyle={styles.avatar}
                src={matchItem.images[0]}
              />
            </View>

            <View
              style={[
                styles.cardInfo,
                isRTL ? styles.alignRight : styles.alignLeft,
              ]}>
              <CustomText text={matchItem.name} customStyle={styles.nameText} />
              <CustomText
                text={`${t('matchCard.age')}: ${matchItem.age} | ${t(
                  'matchCard.height',
                )}: ${matchItem.height}`}
                customStyle={styles.metaText}
              />
              <CustomText
                text={`${t('matchCard.status')}: ${t(matchItem.status)}${
                  matchItem.numOfChildren ? ` + ${matchItem.numOfChildren}` : ''
                }`}
                customStyle={styles.metaText}
              />
              <CustomText
                text={`${t('matchCard.cityShort')}: ${
                  matchItem.city ? t(matchItem.city) : ''
                }`}
                customStyle={styles.metaText}
              />
              <CustomText
                text={`${t('phoneNumber')}: ${matchItem.phone}`}
                customStyle={styles.metaText}
              />
            </View>

            <View style={styles.actions}>
              <CustomButton
                text="view"
                customStyle={styles.viewButton}
                customTextStyle={styles.actionText}
                onPress={() => navigation.navigate('MatchCardsScreen')}
              />
              <CustomButton
                text="edit"
                customStyle={styles.editButton}
                customTextStyle={styles.actionText}
                onPress={() =>
                  navigation.navigate('EditFormScreen', {card: matchItem})
                }
              />
            </View>
          </View>
        );
      })}
    </HomeScreen>
  );
};

export default AdminAllCardsScreen;
