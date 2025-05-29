import React, { useState } from 'react';
import { View } from 'react-native';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomTab from '../../components/CustomTab/CustomTab';
import CustomText from '../../components/CustomText/CustomText';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import HomeScreen from '../HomeScreen/HomeScreen';
import { styles } from './Login.style';

const Login = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleLoginApp = () => {
    navigation?.navigate("MainScreen");
  }

  const handleTabPress = (index: number) => {
    setActiveTab(index);
  };

  const tabs = [
    { label: 'שדכנ/ית' },
    { label: 'משודך' },
  ];

  return (
    <View style={styles.container}>
      <HomeScreen>
        <CustomText text={"ברוכים הבאים"} customStyle={styles.title} />
        <WhiteCard customStyle={styles.whiteCardContainer}>
          <CustomTab
            tabs={tabs}
            activeTab={activeTab}
            onTabPress={handleTabPress}
          />
          <View style={styles.space}>
            <CustomInput placeholder={"נייד:"} keyboardType={"numeric"} maxLength={10} />
          </View>
          <View style={styles.space}>
            {activeTab === 0 ?
              <CustomInput placeholder={"סיסמא:"} keyboardType={"default"} />
              :
              <CustomInput placeholder={"קוד שדכנית:"} keyboardType={"numeric"} maxLength={10} />
            }
          </View>
          <View style={styles.space}>
            <CustomButton text='כניסה' onPress={() => handleLoginApp()} />
          </View>
        </WhiteCard>
      </HomeScreen>
    </View>
  );
};

export default Login;
