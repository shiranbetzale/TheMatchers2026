import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import CustomButton from '../../components/CustomButton/CustomButton';
import CustomFilter from '../../components/CustomFilter/CustomFilter';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import CustomOrderBy from '../../components/CustomOrderBy/CustomOrderBy';
import MatchCard from '../../components/MatchCard/MatchCard';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import FilterSvg from '../../assets/images/filter.svg';
import OrderBySvg from '../../assets/images/orderBy.svg';
import HomeScreen from '../HomeScreen/HomeScreen';
import {styles} from './AllCardsScreen.style';
import CustomText from '../../components/CustomText/CustomText';
import {FontsStyle} from '../../utils/FontsStyle';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {getSessionUser} from '../../services/session';
import {isArchivedCard} from '../../utils/archiveCards';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type AllCardsRouteProp = RouteProp<RootStackParamList, 'AllCardsScreen'>;

const AllCardsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AllCardsRouteProp>();
  const onlyMine = route.params?.onlyMine === true;
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [isShowOrderBy, setIsShowOrderBy] = useState(false);
  const [sessionPhone, setSessionPhone] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const allCardsArray: MatchCardType[] = [
    {
      city: 'cityBneiBrak',
      matcherMail: 'matchmaker1@example.com',
      mail: 'candidate1@example.com',
      phone: '0521111111',
      matcherPhone: '0549450954',
      matcherName: 'matchmakerShiranBetzalel',
      name: 'David Levi',
      offered: true,
      met: false,
      gender: 'male',
      age: 29,
      height: '1.78',
      status: 'single',
      relationshipStatus: 'engaged',
      partnerName: 'Miriam Cohen',
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
      matcherName: 'matchmakerShiranBetzalel',
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
      matcherName: 'matchmakerShiranBetzalel',
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
      matcherName: 'matchmakerShiranBetzalel',
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

  useEffect(() => {
    const loadSession = async () => {
      const sessionUser = await getSessionUser();
      setSessionPhone(sessionUser?.phone ?? '');
      setIsAdmin(sessionUser?.role === 'admin');
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (onlyMine) {
      setIsShowOrderBy(false);
      setIsShowFilter(false);
    }
  }, [onlyMine]);

  const visibleCards = useMemo(() => {
    if (!onlyMine || isAdmin) {
      return allCardsArray.filter(card => !isArchivedCard(card));
    }

    const normalizedSessionPhone = sessionPhone.replace(/\D/g, '');

    if (!normalizedSessionPhone) {
      return [];
    }

    return allCardsArray.filter(
      card =>
        !isArchivedCard(card) &&
        card.matcherPhone.replace(/\D/g, '') === normalizedSessionPhone,
    );
  }, [allCardsArray, isAdmin, onlyMine, sessionPhone]);

  const matcherOptions = useMemo(() => {
    const matcherNames = Array.from(
      new Set(allCardsArray.map(card => card.matcherName).filter(Boolean)),
    );

    return matcherNames.map((matcherName, index) => ({
      id: index + 1,
      name: 'matcherName',
      label: matcherName || '',
    }));
  }, [allCardsArray]);

  const currentMatcherName = useMemo(() => {
    if (!onlyMine) {
      return undefined;
    }

    const normalizedSessionPhone = sessionPhone.replace(/\D/g, '');
    const matchingCard = allCardsArray.find(
      card =>
        normalizedSessionPhone &&
        card.matcherPhone.replace(/\D/g, '') === normalizedSessionPhone,
    );

    return matchingCard?.matcherName ?? visibleCards.find(card => card.matcherName)?.matcherName;
  }, [allCardsArray, onlyMine, sessionPhone, visibleCards]);

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
  const isMenuOpen = isShowFilter || isShowOrderBy;

  return (
    <HomeScreen
      pinChildren={
        <View style={styles.pinChildrenContainer}>
          <CustomHeader headerBtns={headerBtns} />
          {isShowFilter && (
            <CustomFilter
              isMyCards={onlyMine}
              matcherName={currentMatcherName}
              matcherOptions={matcherOptions}
              onApply={closeMenus}
              onReset={closeMenus}
            />
          )}
          {isShowOrderBy && (
            <CustomOrderBy onApply={closeMenus} onReset={closeMenus} />
          )}
        </View>
      }>
      {!isMenuOpen && (
        <>
          {visibleCards.length === 0 && (
            <CustomText
              text="noAssignedCards"
              customStyle={FontsStyle.text}
            />
          )}
          {visibleCards.map((matchItem, index) => {
            return (
              <CustomButton
                key={index}
                onPress={() => navigation.navigate('MatchCardsScreen')}
                customStyle={styles.matchCard}>
                <MatchCard
                  {...matchItem}
                  isSlide={false}
                  isShowMeetingInfo={false}
                />
              </CustomButton>
            );
          })}
        </>
      )}
    </HomeScreen>
  );
};

export default AllCardsScreen;
