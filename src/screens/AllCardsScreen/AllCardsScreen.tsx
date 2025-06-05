import React, {useState} from 'react';
import {View} from 'react-native';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomFilter from '../../components/CustomFilter/CustomFilter';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import CustomOrderBy from '../../components/CustomOrderBy/CustomOrderBy';
import MatchCard from '../../components/MatchCard/MatchCard';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import FilterSvg from '../../assets/images/filter.svg';
import OrderBySvg from '../../assets/images/orderBy.svg';
import Colors from '../../utils/Colors';
import HomeScreen from '../HomeScreen/HomeScreen';
import {styles} from './AllCardsScreen.style';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';

const AllCardsScreen = () => {
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);
  const [isShowOrderBy, setIsShowOrderBy] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const allCardsArray: MatchCardType[] = [
    {
      city: 'בני ברק',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      name: 'XXX',
      offered: false,
      met: false,
      gender: 'זכר',
      age: 50,
      height: '1.85',
      status: 'גרוש',
      numOfChildren: 0,
      images: [
        'https://www.shutterstock.com/image-photo/3d-image-male-character-attacking-600w-2274399929.jpg',
        'https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg',
      ],
    },
    {
      city: 'בני ברק',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      name: 'XXX',
      offered: false,
      met: false,
      gender: 'נקבה',
      age: 54,
      height: '1.80',
      status: 'אלמן',
      numOfChildren: 1,
      images: [
        'https://www.shutterstock.com/image-photo/milk-chocolate-splash-smooth-abstract-600w-2259581367.jpg',
      ],
    },
    {
      city: 'בני ברק',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      name: 'XXX',
      offered: false,
      met: false,
      gender: 'נקבה',
      age: 50,
      height: '1.85',
      status: 'רווק',
      numOfChildren: 5,
      images: [
        'https://www.shutterstock.com/image-photo/origami-3d-image-graphic-600w-2284548165.jpg',
      ],
    },
    {
      city: 'בני ברק',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      name: 'XXX',
      offered: false,
      met: false,
      gender: 'נקבה',
      age: 54,
      height: '1.80',
      status: 'גרוש',
      numOfChildren: 0,
      images: [
        'https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg',
      ],
    },
    {
      city: 'בני ברק',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      name: 'XXX',
      offered: false,
      met: false,
      gender: 'נקבה',
      age: 50,
      height: '1.85',
      status: 'גרוש',
      numOfChildren: 0,
      images: [
        'https://www.shutterstock.com/image-photo/3d-image-male-character-attacking-600w-2274399929.jpg',
      ],
    },
    {
      city: 'בני ברק',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      name: 'XXX',
      offered: false,
      met: false,
      gender: 'זכר',
      age: 54,
      height: '1.80',
      status: 'אלמן',
      numOfChildren: 0,
      images: [
        'https://www.shutterstock.com/image-photo/milk-chocolate-splash-smooth-abstract-600w-2259581367.jpg',
      ],
    },
    {
      city: 'בני ברק',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      name: 'XXX',
      offered: false,
      met: false,
      gender: 'זכר',
      age: 50,
      height: '1.85',
      status: 'רווק',
      numOfChildren: 0,
      images: [
        'https://www.shutterstock.com/image-photo/origami-3d-image-graphic-600w-2284548165.jpg',
      ],
    },
    {
      city: 'בני ברק',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      name: 'XXX',
      offered: false,
      met: false,
      gender: 'זכר',
      age: 54,
      height: '1.80',
      status: 'רווק',
      numOfChildren: 0,
      images: [
        'https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg',
      ],
    },
  ];

  const handleFilter = () => {
    setIsShowOrderBy(isShowFilter && false);
    setIsShowFilter(!isShowFilter);
  };

  const handleOrderBy = () => {
    setIsShowFilter(isShowOrderBy && false);
    setIsShowOrderBy(!isShowOrderBy);
  };

  const headerBtns = [
    {
      comp: <FilterSvg />,
      onPress: handleFilter,
    },
    {
      comp: <OrderBySvg />,
      onPress: handleOrderBy,
    },
  ];

  return (
    <HomeScreen
      pinChildren={
        <View style={styles.pinChildrenContainer}>
          <CustomHeader headerBtns={headerBtns} />
          {isShowFilter && <CustomFilter />}
          {isShowOrderBy && <CustomOrderBy />}
        </View>
      }>
      {allCardsArray.map((matchItem: MatchCardType, index) => {
        const newColor =
          matchItem.gender === 'זכר' ? Colors.lightBlue : Colors.pink;

        return (
          <CustomButton
            key={index}
            onPress={() => navigation?.navigate('MatchCardsScreen')}
            customStyle={styles.matchCard(newColor)}>
            <MatchCard {...matchItem} isSlide={false} />
          </CustomButton>
        );
      })}
    </HomeScreen>
  );
};

export default AllCardsScreen;
