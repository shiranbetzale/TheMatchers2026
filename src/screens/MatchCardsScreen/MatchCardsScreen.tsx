
import React from 'react';
import CurrentCard from '../../components/CurrentCard/CurrentCard';
import MatchCard from '../../components/MatchCard/MatchCard';
import { MatchCardType } from '../../components/MatchCard/MatchCard.type';
import HomeScreen from '../HomeScreen/HomeScreen';
import { styles } from './MatchCardsScreen.style';

const MatchCardsScreen = () => {
  const matchArray: MatchCardType[] = [
    { name: "XXX", gender: "זכר", age: 50, numOfChildren: 0, height: "1.85", status: "גרוש", image: "https://www.shutterstock.com/image-photo/3d-image-male-character-attacking-600w-2274399929.jpg" },
    { name: "XXX", gender: "נקבה", age: 54, numOfChildren: 0, height: "1.80", status: "אלמן", image: "https://www.shutterstock.com/image-photo/milk-chocolate-splash-smooth-abstract-600w-2259581367.jpg" },
    { name: "XXX", gender: "נקבה", age: 50, numOfChildren: 0, height: "1.85", status: "רווק", image: "https://www.shutterstock.com/image-photo/origami-3d-image-graphic-600w-2284548165.jpg" },
    { name: "XXX", gender: "נקבה", age: 54, numOfChildren: 0, height: "1.80", status: "גרוש", image: "https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg" },
    { name: "XXX", gender: "נקבה", age: 50, numOfChildren: 0, height: "1.85", status: "גרוש", image: "https://www.shutterstock.com/image-photo/3d-image-male-character-attacking-600w-2274399929.jpg" },
    { name: "XXX", gender: "זכר", age: 54, numOfChildren: 0, height: "1.80", status: "אלמן", image: "https://www.shutterstock.com/image-photo/milk-chocolate-splash-smooth-abstract-600w-2259581367.jpg" },
    { name: "XXX", gender: "זכר", age: 50, numOfChildren: 0, height: "1.85", status: "רווק", image: "https://www.shutterstock.com/image-photo/origami-3d-image-graphic-600w-2284548165.jpg" },
    { name: "XXX", gender: "זכר", age: 54, numOfChildren: 0, height: "1.80", status: "רווק", image: "https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg" }
  ];

  const currCard: MatchCardType = {
    gender: "נקבה",
    name: "XXX",
    age: 32,
    height: "1.57",
    status: "אלמן",
    numOfChildren: 5,
    image: "https://www.shutterstock.com/image-photo/origami-3d-image-career-woman-600w-2290557303.jpg"
  }

  return (
    <HomeScreen pinChildren={<CurrentCard {...currCard} />}>
      {matchArray.map((matchItem: MatchCardType, index) => {
        return <MatchCard {...matchItem} key={index} />
      })}
    </HomeScreen>
  );
};

export default MatchCardsScreen;




