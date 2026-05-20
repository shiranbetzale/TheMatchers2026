import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import CustomButton from '../../components/CustomButton/CustomButton';
import CustomText from '../../components/CustomText/CustomText';
import MatchCard from '../../components/MatchCard/MatchCard';
import { MatchCardType } from '../../components/MatchCard/MatchCard.type';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import HomeScreen from '../HomeScreen/HomeScreen';

import Colors from '../../utils/Colors';
import { RootStackParamList } from '../../components/MainStackNavigation/MainStackNavigation.type';
import { styles } from './MainScreen.style';
import { useLanguage } from '../../utils/LanguageProvider';

const MainScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useLanguage();

  const name = 'בצלאל שירן';

  const lastCardsArray: MatchCardType[] = [
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
  ];

  return (
    <HomeScreen>
      <View style={styles.container}>
        <CustomText
          text={`${t('hello')} ${name},`}
          customStyle={styles.name}
        />

        <View style={styles.txt}>
          <CustomText text={t('lastCards')} />
        </View>

        {lastCardsArray.map((item, index) => {
          const isMale = item.gender === 'זכר';
          const bgColor = isMale ? '#E8F0FF' : '#FFF4E8';
          const borderColor = isMale ? Colors.darkGreen : Colors.color1;

          return (
            <CustomButton
              key={index}
              onPress={() =>
                navigation.navigate('MatchCardsScreen')
              }
              customStyle={styles.matchCard(borderColor, bgColor)}
            >
              <MatchCard {...item} isSlide={false} />
            </CustomButton>
          );
        })}

        <CustomButton
          text={t('allCards')}
          onPress={() =>
            navigation.navigate('AllCardsScreen')
          }
        />
      </View>

      <WhiteCard>
        <View style={styles.txt}>
          <CustomText text={t('moreActions')} />
        </View>

        <View style={styles.shortButtons}>
          <CustomButton
            customStyle={styles.btn}
            text={t('singleRegistration')}
            onPress={() =>
              navigation.navigate('MatchCardsScreen')
            }
          />
          <CustomButton
            customStyle={styles.btn}
            text={t('contact')}
            onPress={() =>
              navigation.navigate('MatchCardsScreen')
            }
          />
        </View>
      </WhiteCard>
    </HomeScreen>
  );
};

export default MainScreen;
