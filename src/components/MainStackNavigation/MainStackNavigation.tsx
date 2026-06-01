import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AllCardsScreen from '../../screens/AllCardsScreen/AllCardsScreen';
import ArchiveScreen from '../../screens/ArchiveScreen/ArchiveScreen';
import ContactScreen from '../../screens/ContactScreen/ContactScreen';
import EditFormScreen from '../../screens/EditFormScreen/EditFormScreen';
import Login from '../../screens/Login/Login';
import MainScreen from '../../screens/MainScreen/MainScreen';
import MatchCardsScreen from '../../screens/MatchCardsScreen/MatchCardsScreen';
import MeetingCalendarScreen from '../../screens/MeetingCalendarScreen/MeetingCalendarScreen';
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
      name: 'ArchiveScreen',
      component: ArchiveScreen,
      title: '113',
    },
    {
      name: 'MatchCardsScreen',
      component: MatchCardsScreen,
      title: '222',
    },
    {
      name: 'MeetingCalendarScreen',
      component: MeetingCalendarScreen,
      title: '223',
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
      {stackArr.map((stackItem) => {
        return (
          <Stack.Screen
            key={stackItem.name}
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
