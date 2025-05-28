import React from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import CustomImageBg from '../../components/CustomImageBg/CustomImageBg';
import {styles} from './HomeScreen.style';
import {HomeScreenType} from './HomeScreen.type';
import CustomText from '../../components/CustomText/CustomText';

const HomeScreen = (props: HomeScreenType) => {
  const {children, pinChildren} = props;
  const image = require('../../assets/images/bg2.jpg');

  return (
    <SafeAreaView style={styles.container}>
      <CustomImageBg src={image} customImgStyle={styles.image}>
        <View style={styles.pinChildren}>{pinChildren}</View>
        <ScrollView style={styles.svContainer}>{children}</ScrollView>
      </CustomImageBg>
    </SafeAreaView>
  );
};

export default HomeScreen;
