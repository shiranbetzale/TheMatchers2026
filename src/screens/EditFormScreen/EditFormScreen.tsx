import React, {useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import CustomText from '../../components/CustomText/CustomText';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import EditActiveSvg from '../../assets/images/editActive.svg';
import EditSvg from '../../assets/images/edit.svg';
import SaveSvg from '../../assets/images/save.svg';
import detailsFormArray from '../../utils/DetailsFormFields';
import generateField from '../../utils/GenerateField';
import HomeScreen from '../HomeScreen/HomeScreen';
import {styles} from './EditFormScreen.style';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import {Option} from '../../utils/FormFields.type';
import {calculateAge, formatHebrewDate} from '../../utils/generalFunction';
import {useLanguage} from '../../utils/LanguageProvider';

type EditFormRouteProp = RouteProp<RootStackParamList, 'EditFormScreen'>;
type EditFormNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const normalizeStatus = (status?: string) => {
  const statusMap: Record<string, string> = {
    single: 'singleStatus',
    divorced: 'divorcedStatus',
    widower: 'widowedStatus',
  };

  return status ? statusMap[status] ?? status : '';
};

const normalizeGender = (gender?: string) => {
  const genderMap: Record<string, string> = {
    male: 'male',
    female: 'female',
  };

  return gender ? genderMap[gender] ?? gender : '';
};

const partnerSuggestions = [
  'David Levi',
  'Miriam Cohen',
  'Yosef Friedman',
  'Rachel Stern',
  'XXX',
  'matchmakerShiranBetzalel',
];

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
      isEngaged: String(card?.relationshipStatus === 'engaged'),
      isMarried: String(card?.relationshipStatus === 'married'),
      partnerName: card?.partnerName ?? '',
    },
  );

const EditFormScreen = () => {
  const route = useRoute<EditFormRouteProp>();
  const navigation = useNavigation<EditFormNavigationProp>();
  const {t, isRTL} = useLanguage();
  const card = route.params?.card;
  const [isEditable, setIsEditable] = useState(false);
  const [isPartnerSearchFocused, setIsPartnerSearchFocused] = useState(false);
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

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('MainScreen');
  };

  const isEngaged = formValues.isEngaged === 'true';
  const isMarried = formValues.isMarried === 'true';
  const relationshipStatus = isMarried ? 'married' : isEngaged ? 'engaged' : '';
  const shouldShowPartnerSearch = isEngaged || isMarried;
  const filteredPartnerSuggestions = partnerSuggestions.filter(partnerName => {
    const searchValue = formValues.partnerName?.trim().toLowerCase();

    if (!searchValue) {
      return true;
    }

    return partnerName.toLowerCase().includes(searchValue);
  });

  const updateRelationshipStatus = (status: 'engaged' | 'married') => {
    if (!isEditable) {
      return;
    }

    updateField('isEngaged', String(status === 'engaged'));
    updateField('isMarried', String(status === 'married'));
  };

  const selectPartner = (partnerName: string) => {
    updateField('partnerName', partnerName);
    setIsPartnerSearchFocused(false);
  };

  const headerBtns = [
    {comp: <SaveSvg />, onPress: handleSave},
    {comp: isEditable ? <EditActiveSvg /> : <EditSvg />, onPress: toggleEdit},
  ];

  return (
    <HomeScreen pinChildren={<CustomHeader headerBtns={headerBtns} />}>
      <WhiteCard customStyle={styles.whiteCardContainer}>
        <View style={styles.relationshipHeader}>
          <CustomText text="relationshipStatus" customStyle={styles.relationshipTitle} />
          {relationshipStatus && (
            <CustomText
              text={relationshipStatus === 'married' ? 'marriedStatus' : 'engagedStatus'}
              customStyle={styles.relationshipBadge}
            />
          )}
        </View>

        <View style={[styles.statusOptions, isRTL ? styles.rowReverse : styles.row]}>
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!isEditable}
            onPress={() => updateRelationshipStatus('engaged')}
            style={[
              styles.statusOption,
              isEngaged && styles.statusOptionActive,
              !isEditable && styles.disabledOption,
            ]}>
            <CustomText
              text="engagedStatus"
              customStyle={[
                styles.statusOptionText,
                isEngaged && styles.statusOptionTextActive,
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!isEditable}
            onPress={() => updateRelationshipStatus('married')}
            style={[
              styles.statusOption,
              isMarried && styles.statusOptionActive,
              !isEditable && styles.disabledOption,
            ]}>
            <CustomText
              text="marriedStatus"
              customStyle={[
                styles.statusOptionText,
                isMarried && styles.statusOptionTextActive,
              ]}
            />
          </TouchableOpacity>
        </View>

        {shouldShowPartnerSearch && (
          <View style={styles.partnerSearchContainer}>
            <CustomText
              text="partnerLink"
              customStyle={[
                styles.partnerSearchLabel,
                isRTL ? styles.textRight : styles.textLeft,
              ]}
            />
            <TextInput
              style={[
                styles.partnerSearchInput,
                isRTL ? styles.textRight : styles.textLeft,
                !isEditable && styles.readOnlyInput,
              ]}
              editable={isEditable}
              value={formValues.partnerName}
              placeholder={t('partnerSearchPlaceholder')}
              placeholderTextColor="#A8ADB7"
              onFocus={() => setIsPartnerSearchFocused(true)}
              onChangeText={value => {
                updateField('partnerName', value);
                setIsPartnerSearchFocused(true);
              }}
            />
            {isEditable && isPartnerSearchFocused && (
              <View style={styles.suggestionsPanel}>
                {filteredPartnerSuggestions.length > 0 ? (
                  filteredPartnerSuggestions.slice(0, 5).map(partnerName => (
                    <TouchableOpacity
                      key={partnerName}
                      activeOpacity={0.82}
                      onPress={() => selectPartner(partnerName)}
                      style={styles.suggestionItem}>
                      <CustomText
                        text={partnerName}
                        customStyle={[
                          styles.suggestionText,
                          isRTL ? styles.textRight : styles.textLeft,
                        ]}
                      />
                    </TouchableOpacity>
                  ))
                ) : (
                  <CustomText
                    text="noPartnerResults"
                    customStyle={[
                      styles.emptySuggestion,
                      isRTL ? styles.textRight : styles.textLeft,
                    ]}
                  />
                )}
              </View>
            )}
          </View>
        )}
      </WhiteCard>
      {detailsFormArray.map((item, index) => {
        const fieldProps =
          item.fieldType === 'input' || item.fieldType === 'autocomplete'
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
