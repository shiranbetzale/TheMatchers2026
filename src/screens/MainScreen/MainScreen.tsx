import React from 'react';
import {View} from 'react-native';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomText from '../../components/CustomText/CustomText';
import MatchCard from '../../components/MatchCard/MatchCard';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import HomeScreen from '../HomeScreen/HomeScreen';
import {styles} from './MainScreen.style';

const MainScreen = ({navigation}: any) => {
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

  const name = 'בצלאל שירן';

  return (
    <HomeScreen>
      <View style={styles.container}>
        <CustomText text={`שלום ${name},`} customStyle={styles.name} />
        <View style={styles.txt}>
          <CustomText text={'3 כרטיסים אחרונים שהתווספו'} />
        </View>
        {lastCardsArray.map((matchItem: MatchCardType, index) => {
          const newColor =
            matchItem.gender === 'זכר' ? Colors.lightBlue : Colors.pink;
          return (
            <CustomButton
              key={index}
              onPress={() => navigation?.navigate('MatchCardsScreen')}
              customStyle={styles.matchCard(newColor)}>
              <MatchCard {...matchItem} {...navigation} isSlide={false} />
            </CustomButton>
          );
        })}
        <CustomButton
          text="לכל הכרטיסים"
          onPress={() => {
            navigation?.navigate('AllCardsScreen');
          }}
        />
      </View>
      <WhiteCard>
        <View style={styles.txt}>
          <CustomText text={'פעולות נוספות:'} />
        </View>
        <View style={styles.shortButtons}>
          <CustomButton
            customStyle={styles.btn}
            text="רישום משודך בודד"
            onPress={() => {
              navigation?.navigate('MatchCardsScreen');
            }}
          />
          <CustomButton
            customStyle={styles.btn}
            text="יצירת קשר"
            onPress={() => {
              navigation?.navigate('MatchCardsScreen');
            }}
          />
        </View>
      </WhiteCard>
    </HomeScreen>
  );
};

export default MainScreen;
