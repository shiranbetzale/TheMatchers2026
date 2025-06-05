import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Alert, TextInput, Button} from 'react-native';
import axios from 'axios';

const UsersListScreen = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');

  // שליפת רשימת משתמשים
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.x.x:5000/api/users/all'); // החלף ל-IP של השרת שלך
      setUsers(response.data.users);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // מחיקת משתמש
  const deleteUser = async id => {
    try {
      await axios.delete(`http://192.168.x.x:5000/api/users/delete/${id}`);
      Alert.alert('Success', 'User deleted');
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // עדכון משתמש
  const updateUser = async () => {
    try {
      await axios.put(
        `http://192.168.x.x:5000/api/users/update/${editingUser._id}`,
        {
          fullName: editedName,
          phone: editedPhone,
        },
      );
      Alert.alert('Success', 'User updated');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // הצגת שורה בטבלה
  const renderItem = ({item}) => (
    <View style={{flexDirection: 'row', padding: 10, borderBottomWidth: 1}}>
      {editingUser?._id === item._id ? (
        <>
          <TextInput
            value={editedName}
            onChangeText={setEditedName}
            style={{flex: 1, borderWidth: 1}}
          />
          <TextInput
            value={editedPhone}
            onChangeText={setEditedPhone}
            style={{flex: 1, borderWidth: 1}}
          />
          <Button title="Save" onPress={updateUser} />
          <Button title="Cancel" onPress={() => setEditingUser(null)} />
        </>
      ) : (
        <>
          <Text style={{flex: 1}}>{item.fullName}</Text>
          <Text style={{flex: 1}}>{item.phone}</Text>
          <Button
            title="Edit"
            onPress={() => {
              setEditingUser(item);
              setEditedName(item.fullName);
              setEditedPhone(item.phone);
            }}
          />
          <Button title="Delete" onPress={() => deleteUser(item._id)} />
        </>
      )}
    </View>
  );

  return (
    <View style={{flex: 1, padding: 20}}>
      <Text style={{fontSize: 24, fontWeight: 'bold'}}>Users List</Text>
      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default UsersListScreen;
