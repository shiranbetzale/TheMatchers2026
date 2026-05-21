import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AdminAllCardsScreen from '../../screens/AdminAllCardsScreen/AdminAllCardsScreen';
import AllCardsScreen from '../../screens/AllCardsScreen/AllCardsScreen';
import ContactScreen from '../../screens/ContactScreen/ContactScreen';
import EditFormScreen from '../../screens/EditFormScreen/EditFormScreen';
import Login from '../../screens/Login/Login';
import MainScreen from '../../screens/MainScreen/MainScreen';
import MatchCardsScreen from '../../screens/MatchCardsScreen/MatchCardsScreen';
import RegisterUserScreen from '../../screens/RegisterUserScreen/RegisterUserScreen';
import Wizard from '../Wizard/Wizard';

const Stack = createNativeStackNavigator();

const MainStackNavigation = () => {
  const stackArr = [
    {
      name: 'Wizard',
      component: Wizard,
      title: '000',
    },
    {
      name: 'AllCardsScreen',
      component: AllCardsScreen,
      title: '111',
    },
    {
      name: 'AdminAllCardsScreen',
      component: AdminAllCardsScreen,
      title: '112',
    },
    {
      name: 'MatchCardsScreen',
      component: MatchCardsScreen,
      title: '222',
    },
    {
      name: 'Login',
      component: Login,
      title: '333',
    },
    {
      name: 'MainScreen',
      component: MainScreen,
      title: '444',
    },
    {
      name: 'ContactScreen',
      component: ContactScreen,
      title: '445',
    },
    {
      name: 'EditFormScreen',
      component: EditFormScreen,
      title: '555',
    },
    {
      name: 'RegisterUserScreen',
      component: RegisterUserScreen,
      title: '666',
    },
  ];

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {stackArr.map((stackItem, index) => {
        return (
          <Stack.Screen
            key={index}
            name={stackItem.name}
            component={stackItem.component}
            options={{title: stackItem.title, headerShown: false}}
          />
        );
      })}
    </Stack.Navigator>
  );
};

export default MainStackNavigation;
