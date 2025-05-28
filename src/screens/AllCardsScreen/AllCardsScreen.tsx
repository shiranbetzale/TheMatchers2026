
import React from 'react';
import CustomButton from '../../components/CustomButton/CustomButton';
import MatchCard from '../../components/MatchCard/MatchCard';
import { MatchCardType } from '../../components/MatchCard/MatchCard.type';
import HomeScreen from '../HomeScreen/HomeScreen';
import { styles } from './AllCardsScreen.style';

const AllCardsScreen = ({ navigation }: any) => {
  const allCardsArray: MatchCardType[] = [
    { name: "XXX", gender: "זכר", age: 50, height: "1.85", status: "גרוש", numOfChildren: 0, image: "https://www.shutterstock.com/image-photo/3d-image-male-character-attacking-600w-2274399929.jpg" },
    { name: "XXX", gender: "נקבה", age: 54, height: "1.80", status: "אלמן", numOfChildren: 1, image: "https://www.shutterstock.com/image-photo/milk-chocolate-splash-smooth-abstract-600w-2259581367.jpg" },
    { name: "XXX", gender: "נקבה", age: 50, height: "1.85", status: "רווק", numOfChildren: 5, image: "https://www.shutterstock.com/image-photo/origami-3d-image-graphic-600w-2284548165.jpg" },
    { name: "XXX", gender: "נקבה", age: 54, height: "1.80", status: "גרוש", numOfChildren: 0, image: "https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg" },
    { name: "XXX", gender: "נקבה", age: 50, height: "1.85", status: "גרוש", numOfChildren: 0, image: "https://www.shutterstock.com/image-photo/3d-image-male-character-attacking-600w-2274399929.jpg" },
    { name: "XXX", gender: "זכר", age: 54, height: "1.80", status: "אלמן", numOfChildren: 0, image: "https://www.shutterstock.com/image-photo/milk-chocolate-splash-smooth-abstract-600w-2259581367.jpg" },
    { name: "XXX", gender: "זכר", age: 50, height: "1.85", status: "רווק", numOfChildren: 0, image: "https://www.shutterstock.com/image-photo/origami-3d-image-graphic-600w-2284548165.jpg" },
    { name: "XXX", gender: "זכר", age: 54, height: "1.80", status: "רווק", numOfChildren: 0, image: "https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg" }
  ];

  return (
    <HomeScreen>
      {allCardsArray.map((matchItem: MatchCardType, index) => {
        return <CustomButton onPress={() => navigation?.navigate("MatchCardsScreen")}>
          <MatchCard {...matchItem} key={index} {...navigation} />
        </CustomButton>
      })}
    </HomeScreen>
  );
};

export default AllCardsScreen;




