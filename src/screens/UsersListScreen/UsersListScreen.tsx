import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useLanguage} from '../../utils/LanguageProvider';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import api from '../../services/api';
import CustomText from '../../components/CustomText/CustomText';
import HomeScreen from '../HomeScreen/HomeScreen';
import {styles} from './UsersListScreen.style';
import EditIcon from '../../assets/images/edit.svg';
import SaveIcon from '../../assets/images/save.svg';
import UserAddIcon from '../../assets/images/userAdd.svg';

interface User {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  role?: 'admin' | 'matchmaker';
  gender?: 'male' | 'female';
}

type EditableUser = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  role: 'admin' | 'matchmaker';
  gender: 'male' | 'female';
};

const normalizeRole = (value?: string): 'admin' | 'matchmaker' => {
  const normalized = String(value || '').toLowerCase();
  if (normalized === 'admin') return 'admin';
  if (normalized === 'matchmaker') return 'matchmaker';
  return 'matchmaker';
};

const normalizeGender = (value?: string): 'male' | 'female' => {
  const normalized = String(value || '').toLowerCase();
  if (normalized === 'זכר') return 'male';
  if (normalized === 'נקבה') return 'female';
  return normalized === 'male' ? 'male' : 'female';
};

const UsersListScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<EditableUser>({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    role: 'matchmaker',
    gender: 'male',
  });
  const {t, isRTL} = useLanguage();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const roles: Array<'admin' | 'matchmaker'> = useMemo(
    () => ['admin', 'matchmaker'],
    [],
  );

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get('/api/users/all');
      setUsers(response.data.users);
    } catch (error: any) {
      Alert.alert(t('error'), error.message || t('errorGeneric'));
    }
  }, [t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [fetchUsers]),
  );

  const deleteUser = async (id: string) => {
    try {
      await api.delete(`/api/users/delete/${id}`);
      Alert.alert(t('success'), t('userDeleted'));
      fetchUsers();
    } catch (error: any) {
      Alert.alert(t('error'), error.message || t('errorGeneric'));
    }
  };

  const startEditing = (user: User) => {
    setEditingUser(user);
    setEditedUser({
      fullName: user.fullName || '',
      phone: user.phone || '',
      email: user.email || '',
      password: '',
      role: normalizeRole(user.role),
      gender: normalizeGender(user.gender),
    });
  };

  const stopEditing = () => {
    setEditingUser(null);
    setEditedUser({
      fullName: '',
      phone: '',
      email: '',
      password: '',
      role: 'matchmaker',
      gender: 'male',
    });
  };

  const updateUser = async () => {
    if (!editingUser) return;

    if (!editedUser.fullName || !editedUser.phone || !editedUser.email) {
      Alert.alert(t('error'), t('errorRequiredFields'));
      return;
    }

    try {
      await api.put(`/api/users/update/${editingUser._id}`, {
        fullName: editedUser.fullName.trim(),
        email: editedUser.email.trim().toLowerCase(),
        phone: editedUser.phone.trim(),
        role: editedUser.role,
        gender: editedUser.gender,
        ...(editedUser.password ? {password: editedUser.password} : {}),
      });
      Alert.alert(t('success'), t('userUpdated'));
      stopEditing();
      fetchUsers();
    } catch (error: any) {
      Alert.alert(t('error'), error.message || t('errorGeneric'));
    }
  };

  const renderChoiceRow = (
    titleKey: string,
    options: string[],
    value: string,
    onSelect: (nextValue: any) => void,
  ) => (
    <View style={styles.choiceRow}>
      <CustomText text={titleKey} customStyle={styles.choiceLabel} />
      <View
        style={[
          styles.choiceOptions,
          isRTL ? styles.choiceOptionsRtl : styles.choiceOptionsLtr,
        ]}>
        {options.map(option => {
          const isActive = value === option;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => onSelect(option)}
              style={[styles.choiceChip, isActive && styles.choiceChipActive]}>
              <CustomText
                text={option}
                customStyle={[
                  styles.choiceChipText,
                  isActive && styles.choiceChipTextActive,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderItem = ({item}: {item: User}) => (
    <View style={styles.card}>
      {editingUser?._id === item._id ? (
        <View style={styles.editorContainer}>
          <View
            style={[
              styles.editorTopActions,
              isRTL ? styles.editorTopActionsRtl : styles.editorTopActionsLtr,
            ]}>
            <TouchableOpacity
              onPress={stopEditing}
              style={[styles.iconButton, styles.cancelButton]}>
              <Text style={styles.deleteIcon}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={updateUser}
              style={[styles.iconButton, styles.saveButton]}>
              <SaveIcon width={18} height={18} />
            </TouchableOpacity>
          </View>

          <CustomText text="fullName" customStyle={styles.inputLabel} />
          <TextInput
            value={editedUser.fullName}
            onChangeText={text =>
              setEditedUser(prev => ({...prev, fullName: text}))
            }
            style={[styles.input, isRTL ? styles.inputRtl : styles.inputLtr]}
            placeholder={t('fullName')}
            placeholderTextColor="#8A94A6"
          />
          <CustomText text="mobile" customStyle={styles.inputLabel} />
          <TextInput
            value={editedUser.phone}
            onChangeText={text =>
              setEditedUser(prev => ({
                ...prev,
                phone: /^\d{10}$/.test(text) ? text : '',
              }))
            }
            style={[styles.input, isRTL ? styles.inputRtl : styles.inputLtr]}
            placeholder={t('mobile')}
            placeholderTextColor="#8A94A6"
            keyboardType="numeric"
            inputMode="numeric"
          />
          <CustomText text="email" customStyle={styles.inputLabel} />
          <TextInput
            value={editedUser.email}
            onChangeText={text =>
              setEditedUser(prev => ({...prev, email: text}))
            }
            style={[styles.input, isRTL ? styles.inputRtl : styles.inputLtr]}
            placeholder={t('email')}
            placeholderTextColor="#8A94A6"
            keyboardType="email-address"
          />
          <CustomText text="password" customStyle={styles.inputLabel} />
          <TextInput
            value={editedUser.password}
            onChangeText={text =>
              setEditedUser(prev => ({...prev, password: text}))
            }
            style={[styles.input, isRTL ? styles.inputRtl : styles.inputLtr]}
            placeholder={t('password')}
            placeholderTextColor="#8A94A6"
            secureTextEntry
          />

          {renderChoiceRow(
            'gender',
            ['male', 'female'],
            editedUser.gender,
            next => setEditedUser(prev => ({...prev, gender: next})),
          )}
          {renderChoiceRow('role', roles, editedUser.role, next =>
            setEditedUser(prev => ({
              ...prev,
              role: next as 'admin' | 'matchmaker',
            })),
          )}
        </View>
      ) : (
        <View
          style={[
            styles.viewRow,
            isRTL ? styles.viewRowRtl : styles.viewRowLtr,
          ]}>
          <View style={styles.userDetails}>
            <Text
              style={[
                styles.primaryText,
                isRTL ? styles.textRtl : styles.textLtr,
              ]}>
              {item.fullName}
            </Text>
            <Text
              style={[
                styles.secondaryText,
                isRTL ? styles.textRtl : styles.textLtr,
              ]}>
              {item.phone}
            </Text>
            <Text
              style={[
                styles.secondaryText,
                isRTL ? styles.textRtl : styles.textLtr,
              ]}>
              {item.email || '-'}
            </Text>
            <Text
              style={[
                styles.metaText,
                isRTL ? styles.textRtl : styles.textLtr,
              ]}>
              {isRTL
                ? `${t(normalizeGender(item.gender))} • ${t(normalizeRole(item.role))}`
                : `${t(normalizeRole(item.role))} • ${t(normalizeGender(item.gender))}`}
            </Text>
          </View>

          <View
            style={[
              styles.actionRow,
              isRTL ? styles.actionsSideRtl : styles.actionsSideLtr,
            ]}>
            <TouchableOpacity
              onPress={() => deleteUser(item._id)}
              style={[styles.iconButton, styles.deleteButton]}>
              <Text style={styles.deleteIcon}>🗑</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => startEditing(item)}
              style={[styles.iconButton, styles.editButton]}>
              <EditIcon width={18} height={18} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <HomeScreen
      disableScroll
      pinChildren={
        <View style={styles.headerWrapper}>
          <View
            style={[
              styles.headerRow,
              isRTL ? styles.headerRowRtl : styles.headerRowLtr,
            ]}>
            <CustomText text="usersList" customStyle={styles.title} />
            <TouchableOpacity
              style={styles.addButton}
              accessibilityLabel={t('registerUser')}
              onPress={() => navigation.navigate('RegisterUserScreen')}>
              <UserAddIcon width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>
      }>
      <View style={styles.container}>
        <FlatList
          data={users}
          style={styles.list}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<CustomText text="noUsersFound" />}
        />
      </View>
    </HomeScreen>
  );
};

export default UsersListScreen;
