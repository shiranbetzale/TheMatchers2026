import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { HomeScreenType } from './HomeScreen.type';
import { styles } from './HomeScreen.style';

const HomeScreen = ({ children, pinChildren }: HomeScreenType) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgContainer}>
        <View style={styles.bgShapeOne} />
        <View style={styles.bgShapeTwo} />
      </View>

      {/* תוכן מקובע מעל הרקע */}
      {pinChildren && <View style={styles.pinChildren}>{pinChildren}</View>}

      {/* תוכן גלילה */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
