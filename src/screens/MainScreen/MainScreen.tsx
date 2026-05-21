import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import CustomButton from '../../components/CustomButton/CustomButton';
import CustomText from '../../components/CustomText/CustomText';
import MatchCard from '../../components/MatchCard/MatchCard';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import HomeScreen from '../HomeScreen/HomeScreen';

import Colors from '../../utils/Colors';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {styles} from './MainScreen.style';
import {useLanguage} from '../../utils/LanguageProvider';
import {UserRole, getSessionRole} from '../../services/session';

const MainScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {t} = useLanguage();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const isAdmin = userRole === 'admin';
  const isMatchmaker = userRole === 'matchmaker';

  useEffect(() => {
    getSessionRole().then(setUserRole);
  }, []);

  const name = 'בצלאל שירן';

  const lastCardsArray: MatchCardType[] = [
    {
      city: 'bnei Brak',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      matcherName: 'שירן בצלאל',
      name: 'XXX',
      offered: false,
      met: false,
      gender: 'male',
      age: 50,
      height: '1.85',
      status: 'divorced',
      numOfChildren: 0,
      images: [
        'https://www.shutterstock.com/image-photo/3d-image-male-character-attacking-600w-2274399929.jpg',
      ],
    },
    {
      city: 'bnei Brak',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      matcherName: 'שירן בצלאל',
      name: 'XXX',
      offered: false,
      met: false,
      gender: 'female',
      age: 54,
      height: '1.80',
      status: 'widower',
      numOfChildren: 1,
      images: [
        'https://www.shutterstock.com/image-photo/milk-chocolate-splash-smooth-abstract-600w-2259581367.jpg',
      ],
    },
    {
      city: 'bnei Brak',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      matcherName: 'שירן בצלאל',
      name: 'XXX',
      offered: false,
      met: false,
      gender: 'female',
      age: 50,
      height: '1.85',
      status: 'single',
      numOfChildren: 5,
      images: [
        'https://www.shutterstock.com/image-photo/origami-3d-image-graphic-600w-2284548165.jpg',
      ],
    },
  ];

  return (
    <HomeScreen>
      <View style={styles.container}>
        <CustomText text={`${t('hello')} ${name},`} customStyle={styles.name} />

        <View style={styles.txt}>
          <CustomText text="lastCards" />
        </View>

        {lastCardsArray.map((item, index) => {
          const isMale = item.gender === 'male';
          const bgColor = isMale ? '#E8F0FF' : '#FFF4E8';
          const borderColor = isMale ? Colors.darkGreen : Colors.color1;

          return (
            <CustomButton
              key={index}
              onPress={() => navigation.navigate('MatchCardsScreen')}
              customStyle={styles.matchCard(borderColor, bgColor)}>
              <MatchCard {...item} isSlide={false} />
            </CustomButton>
          );
        })}

        <CustomButton
          text={t('allCards')}
          onPress={() =>
            navigation.navigate(
              isAdmin ? 'AdminAllCardsScreen' : 'AllCardsScreen',
            )
          }
        />

        {isMatchmaker && (
          <CustomButton
            text="matchmakerCards"
            onPress={() => navigation.navigate('MatchmakerCardsScreen')}
          />
        )}
      </View>

      <WhiteCard>
        <View style={styles.txt}>
          <CustomText text="moreActions" />
        </View>

        <View style={styles.shortButtons}>
          <CustomButton
            customStyle={styles.btn}
            text="singleRegistration"
            onPress={() => navigation.navigate('Wizard')}
          />
          <CustomButton
            customStyle={styles.btn}
            text="contact"
            onPress={() => navigation.navigate('ContactScreen')}
          />
        </View>
      </WhiteCard>
    </HomeScreen>
  );
};

export default MainScreen;
