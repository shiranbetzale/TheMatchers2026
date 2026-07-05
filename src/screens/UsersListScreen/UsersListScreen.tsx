import React, {useCallback, useEffect, useMemo, useState} from 'react';
import CustomButton, {
  BUTTON_ICON_SIZE,
} from '../../components/CustomButton/CustomButton';
import CloseIcon from '../../components/CloseIcon/CloseIcon';
import {View, Text, FlatList, TextInput} from 'react-native';
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
import TrashIcon from '../../assets/images/trash.svg';
import Colors from '../../utils/Colors';

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

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

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
  const roles: UserRole[] = useMemo(() => ['admin', 'matchmaker', 'user'], []);

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
        (normalizedPhoneSearch ? phone.includes(normalizedPhoneSearch) : false)
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
        style={[styles.choiceOptions, isRTL ? styles.rowReverse : styles.row]}>
        {options.map(option => {
          const isActive = value === option;
          return (
            <CustomButton
              unstyled
              key={option}
              accessibilityLabel={`${t(titleKey)}: ${t(option)}`}
              accessibilityRole="radio"
              accessibilityState={{selected: isActive}}
              onPress={() => onSelect(option)}
              style={[styles.choiceChip, isActive && styles.choiceChipActive]}>
              {isActive ? (
                <CustomText text="✓" customStyle={styles.choiceCheck} />
              ) : null}
              <CustomText
                text={option}
                customStyle={[
                  styles.choiceChipText,
                  isActive && styles.choiceChipTextActive,
                ]}
              />
            </CustomButton>
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
            <CustomButton
              variant="icon"
              accessibilityLabel={t('cancel')}
              onPress={stopEditing}
              style={styles.iconButton}>
              <CloseIcon />
            </CustomButton>
            <CustomButton
              variant="icon"
              accessibilityLabel={t('save')}
              onPress={updateUser}
              style={styles.iconButton}>
              <SaveIcon width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
            </CustomButton>
          </View>

          <CustomText text="fullName" customStyle={styles.inputLabel} />
          <TextInput
            value={editedUser.fullName}
            onChangeText={text =>
              setEditedUser(prev => ({...prev, fullName: text}))
            }
            style={[styles.input, isRTL ? styles.textRight : styles.textLeft]}
            placeholder={t('fullName')}
            placeholderTextColor={Colors.placeholder}
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
            style={[styles.input, isRTL ? styles.textRight : styles.textLeft]}
            placeholder={t('mobile')}
            placeholderTextColor={Colors.placeholder}
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
            style={[styles.input, isRTL ? styles.textRight : styles.textLeft]}
            placeholder={t('email')}
            placeholderTextColor={Colors.placeholder}
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
            style={[styles.input, isRTL ? styles.textRight : styles.textLeft]}
            placeholder={t('password')}
            placeholderTextColor={Colors.placeholder}
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
        <View style={[styles.viewRow, isRTL ? styles.rowReverse : styles.row]}>
          <View style={styles.userDetails}>
            <Text
              style={[
                styles.primaryText,
                isRTL ? styles.textRight : styles.textLeft,
              ]}>
              {item.fullName}
            </Text>
            <Text
              style={[
                styles.secondaryText,
                isRTL ? styles.textRight : styles.textLeft,
              ]}>
              {item.phone}
            </Text>
            <Text
              style={[
                styles.secondaryText,
                isRTL ? styles.textRight : styles.textLeft,
              ]}>
              {item.email || '-'}
            </Text>
            <Text
              style={[
                styles.metaText,
                isRTL ? styles.textRight : styles.textLeft,
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
            <CustomButton
              variant="iconDanger"
              accessibilityLabel={t('delete')}
              onPress={() => deleteUser(item._id)}
              icon={
                <TrashIcon
                  width={BUTTON_ICON_SIZE}
                  height={BUTTON_ICON_SIZE}
                />
              }
            />
            <CustomButton
              variant="icon"
              accessibilityLabel={t('edit')}
              onPress={() => startEditing(item)}
              icon={
                <EditIcon width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
              }
            />
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
            style={[styles.headerRow, isRTL ? styles.rowReverse : styles.row]}>
            <CustomText text="usersList" customStyle={styles.title} />
            <CustomButton
              variant="icon"
              accessibilityLabel={t('registerUser')}
              onPress={() => navigation.navigate('RegisterUserScreen')}
              icon={
                <UserAddIcon
                  width={BUTTON_ICON_SIZE}
                  height={BUTTON_ICON_SIZE}
                />
              }
            />
          </View>

          <TextInput
            value={searchValue}
            onChangeText={setSearchValue}
            style={[
              styles.searchInput,
              isRTL ? styles.textRight : styles.textLeft,
            ]}
            placeholder={t('usersSearchPlaceholder')}
            placeholderTextColor={Colors.placeholder}
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
