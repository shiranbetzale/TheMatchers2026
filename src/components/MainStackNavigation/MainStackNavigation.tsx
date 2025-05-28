import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AllCardsScreen from '../../screens/AllCardsScreen/AllCardsScreen';
import MatchCardsScreen from '../../screens/MatchCardsScreen/MatchCardsScreen';
import Wizard from '../Wizard/Wizard';
import { styles } from './MainStackNavigation.style';

const Stack = createNativeStackNavigator();

const MainStackNavigation = () => {
  const stackArr = [
    {
      name: "Wizard",
      component: Wizard,
      title: "000"
    },
    {
      name: "AllCardsScreen",
      component: AllCardsScreen,
      title: "111"
    },
    {
      name: "MatchCardsScreen",
      component: MatchCardsScreen,
      title: "222"
    }
  ]

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {
        stackArr.map((stackItem, index) => {
          return <Stack.Screen
            key={index}
            name={stackItem.name}
            component={stackItem.component}
            options={{ title: stackItem.title, headerShown: false }}
          />
        })
      }
    </Stack.Navigator>
  );
};

export default MainStackNavigation;
