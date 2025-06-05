import React, {useState} from 'react';
import {View, Alert} from 'react-native';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomText from '../../components/CustomText/CustomText';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import HomeScreen from '../HomeScreen/HomeScreen';
import {styles} from './RegisterScreen.style';
import axios from 'axios';

const RegisterScreen = ({navigation}: any) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSave = async () => {
    if (!fullName || !phone) {
      Alert.alert('שגיאה', 'נא למלא את כל השדות');
      return;
    }

    try {
      const response = await axios.post(
        'http://192.168.x.x:5000/api/users/register',
        {
          fullName,
          phone,
        },
      );
      Alert.alert('הצלחה', 'המשתמש נרשם בהצלחה');
      //  navigation?.navigate('UsersList'); // ודא שיש מסך כזה או שנה לניווט אחר
    } catch (error) {
      if (error?.response) {
        // השרת החזיר שגיאה
        console.log('Server error:', error?.response.data);
        Alert.alert('שגיאה', error.response?.data.message || 'שגיאה בשרת');
      } else if (error?.request) {
        // לא התקבלה תגובה מהשרת
        console.log('No response from server:', error?.request);
        Alert.alert('שגיאה', 'לא התקבלה תגובה מהשרת');
      } else {
        // שגיאה אחרת
        console.log('Error', error?.message);
        Alert.alert('שגיאה', error?.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <HomeScreen>
        <CustomText text={'רישום שדכנ/ית'} customStyle={styles.title} />
        <WhiteCard customStyle={styles.whiteCardContainer}>
          <CustomInput placeholder={'שם מלא:'} onChangeText={setFullName} />
          <CustomInput
            placeholder={'נייד:'}
            keyboardType={'numeric'}
            maxLength={10}
            onChangeText={setPhone}
          />
          <View style={styles.space}>
            <CustomButton text="שמור" onPress={handleSave} />
          </View>
        </WhiteCard>
      </HomeScreen>
    </View>
  );
};

export default RegisterScreen;
