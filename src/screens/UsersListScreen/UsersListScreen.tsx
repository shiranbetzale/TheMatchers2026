import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../utils/LanguageProvider';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../components/MainStackNavigation/MainStackNavigation.type';
import api from '../../services/api';

interface User {
  _id: string;
  fullName: string;
  phone: string;
}

const UsersListScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const { t } = useLanguage();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // שליפת רשימת משתמשים
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

  // מחיקת משתמש
  const deleteUser = async (id: string) => {
    try {
      await api.delete(`/api/users/delete/${id}`);
      Alert.alert(t('success'), t('userDeleted'));
      fetchUsers();
    } catch (error: any) {
      Alert.alert(t('error'), error.message || t('errorGeneric'));
    }
  };

  // עדכון משתמש
  const updateUser = async () => {
    if (!editingUser) return;

    if (!editedName || !editedPhone) {
      Alert.alert(t('error'), t('errorRequiredFields'));
      return;
    }

    try {
      await api.put(`/api/users/update/${editingUser._id}`, {
        fullName: editedName,
        phone: editedPhone,
      });
      Alert.alert(t('success'), t('userUpdated'));
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      Alert.alert(t('error'), error.message || t('errorGeneric'));
    }
  };

  // הצגת שורה בטבלה
  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.row}>
      {editingUser?._id === item._id ? (
        <>
          <TextInput
            value={editedName}
            onChangeText={setEditedName}
            style={styles.input}
          />
          <TextInput
            value={editedPhone}
            onChangeText={text => setEditedPhone(text.replace(/\D+/g, ''))}
            style={styles.input}
            keyboardType="numeric"
            inputMode="numeric"
          />
          <Button title={t('save')} onPress={updateUser} />
          <Button title={t('cancel')} onPress={() => setEditingUser(null)} />
        </>
      ) : (
        <>
          <Text style={styles.text}>{item.fullName}</Text>
          <Text style={styles.text}>{item.phone}</Text>
          <Button
            title={t('edit')}
            onPress={() => {
              setEditingUser(item);
              setEditedName(item.fullName);
              setEditedPhone(item.phone);
            }}
          />
          <Button title={t('delete')} onPress={() => deleteUser(item._id)} />
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t('usersList')}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('RegisterUserScreen')}
        >
          <Text style={styles.addButtonText}>+ {t('registerUser')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.text, styles.headerCell]}>{t('fullName')}</Text>
        <Text style={[styles.text, styles.headerCell]}>{t('mobile')}</Text>
        <Text style={[styles.text, styles.headerCell]}>{t('actions') || 'Actions'}</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>{t('noUsersFound')}</Text>}
      />
    </View>
  );
};

export default UsersListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  addButton: { backgroundColor: '#0F2E63', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: '600' },
  tableHeader: { flexDirection: 'row', marginBottom: 6 },
  headerCell: { fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  text: { flex: 1 },
  input: { flex: 1, borderWidth: 1, padding: 5, marginRight: 5 },
});
