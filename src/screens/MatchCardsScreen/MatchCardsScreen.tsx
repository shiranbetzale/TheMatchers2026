
import React from 'react';
import { View } from 'react-native';
import CurrentCard from '../../components/CurrentCard/CurrentCard';
import MatchCard from '../../components/MatchCard/MatchCard';
import { MatchCardType } from '../../components/MatchCard/MatchCard.type';
import HomeScreen from '../HomeScreen/HomeScreen';
import { styles } from './MatchCardsScreen.style';

const MatchCardsScreen = ({ navigation }: any) => {
  const matchArray: MatchCardType[] = [
    { city: "בני ברק", matcherMail: "shiranbetzalel1990@gmail.com", mail: "shiranbetzalel1990@gmail.com", phone: "0549450954", matcherPhone: "0549450954", name: "XXX", offered: false, met: false, gender: "זכר", age: 50, numOfChildren: 0, height: "1.85", status: "גרוש", images: ["https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg", "https://www.shutterstock.com/image-photo/3d-image-male-character-attacking-600w-2274399929.jpg"] },
    { city: "בני ברק", matcherMail: "shiranbetzalel1990@gmail.com", mail: "shiranbetzalel1990@gmail.com", phone: "0549450954", matcherPhone: "0549450954", name: "XXX", offered: false, met: false, gender: "נקבה", age: 54, numOfChildren: 0, height: "1.80", status: "אלמן", images: ["https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg", "https://www.shutterstock.com/image-photo/milk-chocolate-splash-smooth-abstract-600w-2259581367.jpg"] },
    { city: "בני ברק", matcherMail: "shiranbetzalel1990@gmail.com", mail: "shiranbetzalel1990@gmail.com", phone: "0549450954", matcherPhone: "0549450954", name: "XXX", offered: false, met: false, gender: "נקבה", age: 50, numOfChildren: 0, height: "1.85", status: "רווק", images: ["https://www.shutterstock.com/image-photo/origami-3d-image-graphic-600w-2284548165.jpg"] },
    { city: "בני ברק", matcherMail: "shiranbetzalel1990@gmail.com", mail: "shiranbetzalel1990@gmail.com", phone: "0549450954", matcherPhone: "0549450954", name: "XXX", offered: false, met: false, gender: "נקבה", age: 54, numOfChildren: 0, height: "1.80", status: "גרוש", images: ["https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg"] },
    { city: "בני ברק", matcherMail: "shiranbetzalel1990@gmail.com", mail: "shiranbetzalel1990@gmail.com", phone: "0549450954", matcherPhone: "0549450954", name: "XXX", offered: false, met: false, gender: "נקבה", age: 50, numOfChildren: 0, height: "1.85", status: "גרוש", images: ["https://www.shutterstock.com/image-photo/3d-image-male-character-attacking-600w-2274399929.jpg"] },
    { city: "בני ברק", matcherMail: "shiranbetzalel1990@gmail.com", mail: "shiranbetzalel1990@gmail.com", phone: "0549450954", matcherPhone: "0549450954", name: "XXX", offered: false, met: false, gender: "זכר", age: 54, numOfChildren: 0, height: "1.80", status: "אלמן", images: ["https://www.shutterstock.com/image-photo/milk-chocolate-splash-smooth-abstract-600w-2259581367.jpg"] },
    { city: "בני ברק", matcherMail: "shiranbetzalel1990@gmail.com", mail: "shiranbetzalel1990@gmail.com", phone: "0549450954", matcherPhone: "0549450954", name: "XXX", offered: false, met: false, gender: "זכר", age: 50, numOfChildren: 0, height: "1.85", status: "רווק", images: ["https://www.shutterstock.com/image-photo/origami-3d-image-graphic-600w-2284548165.jpg"] },
    { city: "בני ברק", matcherMail: "shiranbetzalel1990@gmail.com", mail: "shiranbetzalel1990@gmail.com", phone: "0549450954", matcherPhone: "0549450954", name: "XXX", offered: false, met: false, gender: "זכר", age: 54, numOfChildren: 0, height: "1.80", status: "רווק", images: ["https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg"] }
  ];

  const currCard: MatchCardType = {
    gender: "נקבה",
    name: "XXX",
    age: 32,
    height: "1.57",
    status: "אלמן",
    numOfChildren: 5,
    city: "בני ברק",
    images: ["https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg", "https://www.shutterstock.com/image-photo/milk-chocolate-splash-smooth-abstract-600w-2259581367.jpg", "https://www.shutterstock.com/image-photo/origami-3d-image-career-woman-600w-2290557303.jpg"],
    mail: "shiranbetzalel1990@gmail.com",
    phone: "0549450954",
    matcherPhone: "0549450954"
  }

  return (
    <HomeScreen pinChildren={<CurrentCard {...currCard} navigation={navigation} />}>
      {matchArray.map((matchItem: MatchCardType, index) => {
        return <View style={styles.card}>
          <MatchCard
            isShowMoreInfo={false}
            isShowInfoButtons={true}
            isShowMeetingInfo={true}
            {...matchItem} key={index}
          />
        </View>
      })}
    </HomeScreen>
  );
};

export default MatchCardsScreen;




