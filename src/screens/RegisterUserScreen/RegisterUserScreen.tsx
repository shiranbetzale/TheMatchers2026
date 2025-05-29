import React from 'react';
import { View } from 'react-native';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import HomeScreen from '../HomeScreen/HomeScreen';
import { styles } from './RegisterUserScreen.style';

const RegisterUserScreen = ({ navigation }: any) => {

  const handleRegister = () => {

  }

  return (
    <HomeScreen>
      <WhiteCard>
        <View style={styles.space}>
          <CustomInput placeholder={"שם מלא"} keyboardType={"default"} />
        </View>
        <View style={styles.space}>
          <CustomInput placeholder={"נייד"} keyboardType={"numeric"} maxLength={10} />
        </View>
        <View style={styles.space}>
          <CustomInput placeholder={"אימייל"} keyboardType={"default"} />
        </View>
        <View style={styles.space}>
          <CustomInput placeholder={"סיסמא"} keyboardType={"default"} />
        </View>
        <View>
          <CustomButton text='רישום יוזר' onPress={() => handleRegister()} />
        </View>
      </WhiteCard>
    </HomeScreen >
  );
};

export default RegisterUserScreen;




