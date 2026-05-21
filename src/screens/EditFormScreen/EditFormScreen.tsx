import React, {useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import EditSvg from '../../assets/images/edit.svg';
import SaveSvg from '../../assets/images/save.svg';
import detailsFormArray from '../../utils/DetailsFormFields';
import generateField from '../../utils/GenerateField';
import HomeScreen from '../HomeScreen/HomeScreen';
import {styles} from './EditFormScreen.style';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import {Option} from '../../utils/FormFields.type';
import {calculateAge} from '../../utils/generalFunction';

type EditFormRouteProp = RouteProp<RootStackParamList, 'EditFormScreen'>;

const normalizeStatus = (status?: string) => {
  const statusMap: Record<string, string> = {
    single: 'רווק/ה',
    divorced: 'גרוש/ה',
    widower: 'אלמן/ה',
    רווק: 'רווק/ה',
    גרוש: 'גרוש/ה',
    אלמן: 'אלמן/ה',
  };

  return status ? statusMap[status] ?? status : '';
};

const normalizeGender = (gender?: string) => {
  const genderMap: Record<string, string> = {
    male: 'זכר',
    female: 'נקבה',
  };

  return gender ? genderMap[gender] ?? gender : '';
};

const formatHebrewDate = (date: Date) =>
  new Intl.DateTimeFormat('he-IL-u-ca-hebrew', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

const getInitialFormValues = (card?: MatchCardType) =>
  detailsFormArray.reduce<Record<string, string>>(
    (values, item) => {
      if (item.fieldType === 'input' && item.defaultValue !== undefined) {
        values[item.id] = String(item.defaultValue);
      }

      return values;
    },
    {
      fullName: card?.name ?? '',
      gender: normalizeGender(card?.gender),
      age: card?.age !== undefined ? String(card.age) : '',
      hight: card?.height ?? '',
      city: card?.city ?? '',
      status: normalizeStatus(card?.status),
      countOfChildren:
        card?.numOfChildren !== undefined ? String(card.numOfChildren) : '',
      phone: card?.phone ?? '',
      mail: card?.mail ?? '',
    },
  );

const EditFormScreen = () => {
  const route = useRoute<EditFormRouteProp>();
  const card = route.params?.card;
  const [isEditable, setIsEditable] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>(() =>
    getInitialFormValues(card),
  );

  const toggleEdit = () => setIsEditable(prev => !prev);

  const updateField = (id: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const updateBirthDate = (date: Date) => {
    setFormValues(prev => ({
      ...prev,
      birthDate: date.toISOString(),
      birthDateHe: formatHebrewDate(date),
      age: String(calculateAge(date)),
    }));
  };

  const handleSave = () => {
    // כאן תוכלי להוסיף שמירת הנתונים לשרת או local state
    console.log('Save clicked', formValues);
    setIsEditable(false);
  };

  const headerBtns = [
    {comp: <SaveSvg />, onPress: handleSave},
    {comp: <EditSvg />, onPress: toggleEdit},
  ];

  return (
    <HomeScreen pinChildren={<CustomHeader headerBtns={headerBtns} />}>
      {detailsFormArray.map((item, index) => {
        const fieldProps =
          item.fieldType === 'input'
            ? {
                ...item,
                value: formValues[item.id] ?? '',
                isEditable: item.isEditable === false ? false : isEditable,
                onChangeText: (value: string) => updateField(item.id, value),
              }
            : item.fieldType === 'datePicker'
            ? {
                ...item,
                value: formValues[item.id] ?? '',
                isEditable,
                onChangeDate:
                  item.id === 'birthDate'
                    ? updateBirthDate
                    : (date: Date) => updateField(item.id, date.toISOString()),
              }
            : {
                ...item,
                value: formValues[item.id] ?? '',
                isEditable: item.isEditable === false ? false : isEditable,
                handlePress: (option?: Option | boolean) => {
                  if (
                    (item.isEditable === false ? false : isEditable) &&
                    typeof option === 'boolean'
                  ) {
                    updateField(item.id, String(option));
                  }

                  if (
                    (item.isEditable === false ? false : isEditable) &&
                    option &&
                    typeof option !== 'boolean'
                  ) {
                    updateField(item.id, option.label);
                  }
                },
              };

        return (
          <WhiteCard key={index} customStyle={styles.whiteCardContainer}>
            {generateField(fieldProps)}
          </WhiteCard>
        );
      })}
    </HomeScreen>
  );
};

export default EditFormScreen;
