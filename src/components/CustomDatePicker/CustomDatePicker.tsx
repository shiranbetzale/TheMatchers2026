import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {styles} from './CustomDatePicker.style';
import {CustomDatePickerType} from './CustomDatePicker.type';
import DatePicker from 'react-native-date-picker';
import CustomText from '../CustomText/CustomText';
import CustomButton, {
  BUTTON_ICON_SIZE,
} from '../CustomButton/CustomButton';
import DatePickerSvg from '../../assets/images/datePicker.svg';
import {FontsStyle} from '../../utils/FontsStyle';
import {useLanguage} from '../../utils/LanguageProvider';

const CustomDatePicker = (props: CustomDatePickerType) => {
  const {text, value, maxDate, isEditable = true, onChangeDate} = props;
  const {isRTL, language, t} = useLanguage();
  const [date, setDate] = useState<Date | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const valueDate = value ? new Date(value) : undefined;
  const selectedDate =
    date ||
    (valueDate && !Number.isNaN(valueDate.getTime()) ? valueDate : undefined);
  const pickerDate = selectedDate || maxDate || new Date();

  useEffect(() => {
    if (!isEditable && open) {
      setOpen(false);
    }
  }, [isEditable, open]);

  const openPicker = () => {
    if (!isEditable) {
      return;
    }

    setOpen(true);
  };

  return (
    <View style={[styles.container, isRTL ? styles.rowReverse : styles.row]}>
      <View style={styles.labelWrapper}>
        <CustomText
          text={text}
          customStyle={[
            styles.label,
            isRTL ? styles.textRight : styles.textLeft,
          ]}
        />
      </View>
      <CustomButton
        unstyled
        disabled={!isEditable}
        accessibilityLabel={`${t('selectDate')}: ${t(text)}`}
        onPress={openPicker}
        style={[
          styles.dateContainer,
          isRTL ? styles.dateContainerRtl : styles.dateContainerLtr,
          !isEditable && styles.readOnlyDateContainer,
        ]}>
        <CustomText
          text={
            selectedDate
              ? selectedDate.toLocaleDateString(
                  language === 'he' ? 'he-IL' : 'en-US',
                )
              : 'selectDate'
          }
          customStyle={[
            FontsStyle.text,
            styles.dateText,
            !selectedDate && styles.datePlaceholder,
            isRTL ? styles.textRight : styles.textLeft,
          ]}
        />
        <DatePickerSvg
          width={BUTTON_ICON_SIZE}
          height={BUTTON_ICON_SIZE}
        />
      </CustomButton>
      <DatePicker
        modal
        open={isEditable && open}
        date={pickerDate}
        mode="date"
        onConfirm={nextDate => {
          setOpen(false);
          if (!isEditable) {
            return;
          }

          setDate(nextDate);
          onChangeDate?.(nextDate);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        maximumDate={maxDate}
      />
    </View>
  );
};

export default CustomDatePicker;
