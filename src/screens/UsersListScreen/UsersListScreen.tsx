import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, FlatList, TextInput, TouchableOpacity} from 'react-native';
import {useLanguage} from '../../utils/LanguageProvider';
import {useMessage} from '../../utils/MessageProvider';
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
  id?: string;
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  role?: UserRole;
  gender?: 'male' | 'female';
}

type UserRole = 'admin' | 'matchmaker' | 'user';

type EditableUser = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  gender: 'male' | 'female';
};

const normalizeRole = (value?: string): UserRole => {
  const normalized = String(value || '').toLowerCase();
  if (normalized === 'admin') return 'admin';
  if (normalized === 'matchmaker') return 'matchmaker';
  if (normalized === 'user') return 'user';
  return 'user';
};

const normalizeGender = (value?: string): 'male' | 'female' => {
  const normalized = String(value || '').toLowerCase();
  if (normalized === 'זכר') return 'male';
  if (normalized === 'נקבה') return 'female';
  return normalized === 'male' ? 'male' : 'female';
};

const normalizeSearchValue = (value?: string) =>
  String(value || '')
    .trim()
    .toLowerCase();

const normalizePhoneSearchValue = (value?: string) =>
  String(value || '').replace(/\D/g, '');

const normalizePhoneInput = (value: string) =>
  value.replace(/\D/g, '').slice(0, 10);

const isValidMobilePhone = (value: string) => /^05\d{8}$/.test(value);

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getUserId = (user: Partial<User>) => String(user._id || user.id || '');

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
  const [searchValue, setSearchValue] = useState('');
  const {t, isRTL} = useLanguage();
  const {showMessage} = useMessage();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const roles: UserRole[] = useMemo(
    () => ['admin', 'matchmaker', 'user'],
    [],
  );

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get('/api/users/all');
      const nextUsers = Array.isArray(response.data?.users)
        ? response.data.users.map((user: User) => ({
            ...user,
            _id: getUserId(user),
          }))
        : [];

      setUsers(nextUsers.filter((user: User) => Boolean(user._id)));
    } catch (error: any) {
      showMessage({type: 'error', message: error.message || t('errorGeneric')});
    }
  }, [showMessage, t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [fetchUsers]),
  );

  const filteredUsers = useMemo(() => {
    const normalizedSearch = normalizeSearchValue(searchValue);
    const normalizedPhoneSearch = normalizePhoneSearchValue(searchValue);

    if (!normalizedSearch && !normalizedPhoneSearch) {
      return users;
    }

    return users.filter(user => {
      const name = normalizeSearchValue(user.fullName);
      const email = normalizeSearchValue(user.email);
      const phone = normalizePhoneSearchValue(user.phone);

      return (
        name.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        (normalizedPhoneSearch
          ? phone.includes(normalizedPhoneSearch)
          : false)
      );
    });
  }, [searchValue, users]);

  const deleteUser = (id: string) => {
    showMessage({
      type: 'error',
      title: t('delete'),
      message: t('deleteUserConfirm'),
      confirmText: t('delete'),
      cancelText: t('cancel'),
      autoDismissMs: false,
      onConfirm: async () => {
        try {
          await api.delete(`/api/users/delete/${id}`);
          showMessage({type: 'success', message: t('userDeleted')});
          fetchUsers();
        } catch (error: any) {
          showMessage({
            type: 'error',
            message: error.message || t('errorGeneric'),
          });
        }
      },
    });
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
    const editingUserId = getUserId(editingUser || {});

    if (!editingUser || !editingUserId) return;

    const cleanFullName = editedUser.fullName.trim();
    const cleanPhone = normalizePhoneInput(editedUser.phone);
    const cleanEmail = editedUser.email.trim().toLowerCase();

    if (!cleanFullName || !cleanPhone || !cleanEmail) {
      showMessage({type: 'error', message: t('errorRequiredFields')});
      return;
    }

    if (!isValidMobilePhone(cleanPhone)) {
      showMessage({type: 'error', message: t('invalidPhone')});
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      showMessage({type: 'error', message: t('invalidEmail')});
      return;
    }

    try {
      await api.put(`/api/users/update/${editingUserId}`, {
        fullName: cleanFullName,
        email: cleanEmail,
        phone: cleanPhone,
        role: editedUser.role,
        gender: editedUser.gender,
        ...(editedUser.password ? {password: editedUser.password} : {}),
      });
      showMessage({type: 'success', message: t('userUpdated')});
      stopEditing();
      fetchUsers();
    } catch (error: any) {
      showMessage({type: 'error', message: error.message || t('errorGeneric')});
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
      {getUserId(editingUser || {}) === getUserId(item) ? (
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
                phone: normalizePhoneInput(text),
              }))
            }
            style={[styles.input, isRTL ? styles.inputRtl : styles.inputLtr]}
            placeholder={t('mobile')}
            placeholderTextColor="#8A94A6"
            keyboardType="phone-pad"
            inputMode="tel"
            maxLength={10}
          />
          <CustomText text="email" customStyle={styles.inputLabel} />
          <TextInput
            value={editedUser.email}
            onChangeText={text =>
              setEditedUser(prev => ({...prev, email: text.trim()}))
            }
            style={[styles.input, isRTL ? styles.inputRtl : styles.inputLtr]}
            placeholder={t('email')}
            placeholderTextColor="#8A94A6"
            keyboardType="email-address"
            inputMode="email"
            autoCapitalize="none"
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
              role: next as UserRole,
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

          <TextInput
            value={searchValue}
            onChangeText={setSearchValue}
            style={[styles.searchInput, isRTL ? styles.inputRtl : styles.inputLtr]}
            placeholder={t('usersSearchPlaceholder')}
            placeholderTextColor="#8A94A6"
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="default"
          />
        </View>
      }>
      <View style={styles.container}>
        <FlatList
          data={filteredUsers}
          style={styles.list}
          keyExtractor={item => getUserId(item)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<CustomText text="noUsersFound" />}
        />
      </View>
    </HomeScreen>
  );
};

export default UsersListScreen;
