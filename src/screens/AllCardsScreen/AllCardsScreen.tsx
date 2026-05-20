import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import CustomButton from '../../components/CustomButton/CustomButton';
import CustomFilter from '../../components/CustomFilter/CustomFilter';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import CustomOrderBy from '../../components/CustomOrderBy/CustomOrderBy';
import MatchCard from '../../components/MatchCard/MatchCard';
import { MatchCardType } from '../../components/MatchCard/MatchCard.type';
import FilterSvg from '../../assets/images/filter.svg';
import OrderBySvg from '../../assets/images/orderBy.svg';
import Colors from '../../utils/Colors';
import HomeScreen from '../HomeScreen/HomeScreen';
import { styles } from './AllCardsScreen.style';
import { RootStackParamList } from '../../components/MainStackNavigation/MainStackNavigation.type';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const AllCardsScreen = () => {
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [isShowOrderBy, setIsShowOrderBy] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const allCardsArray: MatchCardType[] = [
    // … כל הנתונים שלך כאן
  ];

  const toggleFilter = () => {
    setIsShowOrderBy(false);
    setIsShowFilter(prev => !prev);
  };

  const toggleOrderBy = () => {
    setIsShowFilter(false);
    setIsShowOrderBy(prev => !prev);
  };

  const headerBtns = [
    { comp: <FilterSvg />, onPress: toggleFilter },
    { comp: <OrderBySvg />, onPress: toggleOrderBy },
  ];

  return (
    <HomeScreen
      pinChildren={
        <View style={styles.pinChildrenContainer}>
          <CustomHeader headerBtns={headerBtns} />
          {isShowFilter && <CustomFilter />}
          {isShowOrderBy && <CustomOrderBy />}
        </View>
      }
    >
      {allCardsArray.map((matchItem, index) => {
        const cardColor = matchItem.gender === 'זכר' ? Colors.lightBlue : Colors.pink;
        return (
          <CustomButton
            key={index}
            onPress={() => navigation.navigate('MatchCardsScreen')}
            customStyle={styles.matchCard(cardColor)}
          >
            <MatchCard {...matchItem} isSlide={false} />
          </CustomButton>
        );
      })}
    </HomeScreen>
  );
};

export default AllCardsScreen;
