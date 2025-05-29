import React, {useState} from 'react';
import {View} from 'react-native';
import {styles} from './CustomDatePicker.style';
import {CustomDatePickerType} from './CustomDatePicker.type';
import DatePicker from 'react-native-date-picker';
import CustomText from '../CustomText/CustomText';
import CustomButton from '../CustomButton/CustomButton';
import DatePickerSvg from '../../assets/images/datePicker.svg';
import {FontsStyle} from '../../utils/FontsStyle';

const CustomDatePicker = (props: CustomDatePickerType) => {
  const {text, maxDate} = props;
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <CustomText text={text} />
      <View style={styles.dateContainer}>
        <CustomText
          text={date.toLocaleDateString('he-IL')}
          customStyle={FontsStyle.text}
        />
        <CustomButton
          customStyle={styles.datePickerBtn}
          icon={<DatePickerSvg />}
          onPress={() => setOpen(true)}
        />
        <DatePicker
          modal
          open={open}
          date={date}
          mode="date"
          onConfirm={date => {
            setOpen(false);
            setDate(date);
            // console.log(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
          maximumDate={maxDate}
        />
      </View>
    </View>
  );
};

export default CustomDatePicker;
