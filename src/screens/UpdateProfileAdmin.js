import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Picker} from '@react-native-picker/picker';
import { useNavigation, StackActions } from '@react-navigation/native';

const hostels = [
  { label: 'G1', value: 'G1' },
  { label: 'G2', value: 'G2' },
  { label: 'G3', value: 'G3' },
  { label: 'G4', value: 'G4' },
  { label: 'G5', value: 'G5' },
  { label: 'G6', value: 'G6' },
  { label: 'B1', value: 'B1' },
  { label: 'B2', value: 'B2' },
  { label: 'B3', value: 'B3' },
  { label: 'B4', value: 'B4' },
  { label: 'B5', value: 'B5' },
  { label: 'Y3', value: 'Y3' },
  { label: 'Y4', value: 'Y4' },
  { label: 'O3', value: 'O3' },
  { label: 'O4', value: 'O4' },
  { label: 'I2', value: 'I2' },
  { label: 'I3', value: 'I3' },
];

const UpdateProfile = () => {

  const navigation = useNavigation();

  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newHostel, setNewHostel] = useState('');

  const handleUpdatePassword = async () => {
    try {
      await auth().signInWithEmailAndPassword(auth().currentUser.email, password1);
      await auth().currentUser.updatePassword(newPassword);
      Alert.alert('Success', 'Password updated successfully.');
      await auth().signOut();
      navigation.dispatch(StackActions.replace('Login'));
    } catch (error) {
      console.error('Error updating password: ', error);
      Alert.alert('Error', 'Failed to update password. Please check your current password.');
    }
  };

  const handleUpdateProfile = async () => {
  try{
    await auth().signInWithEmailAndPassword(auth().currentUser.email, password2);
    if (newHostel == "") {
      Alert.alert('Error', 'Invalid hostel name. Please select from the provided options.');
      return;
    }

    try {
      const userId = auth().currentUser.uid;
      await firestore().collection('admins').doc(userId).update({
        hostel: newHostel
      });
      Alert.alert('Success', 'Profile updated successfully.');
      navigation.navigate('HomeAdmin');
    } catch (error) {
      console.error('Error updating profile: ', error);
      Alert.alert('Error', 'Failed to update profile. Please try again later.');
    }
  } catch(error){
      console.error('Error updating password: ', error);
      Alert.alert('Error', 'Failed to update password. Please check your current password.');
  }

  };


  return (
    <View style={styles.container}>
      <Text>Update Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={password1}
        onChangeText={setPassword1}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title="Update Password" onPress={handleUpdatePassword} />

      <Text style={styles.section}>Update Hostel and Room Number:</Text>
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={password2}
        onChangeText={setPassword2}
       />
      <Text>Hostel Name:</Text>
        <Picker
          style = {styles.picker}
          selectedValue={newHostel}
          onValueChange={(value) => setNewHostel(value)}
        >
          <Picker.Item label="Select Hostel" value=""/>
          {hostels.map((hostel, index) => (
            <Picker.Item key={index} label={hostel.label} value={hostel.value} />
          ))}
        </Picker>
      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default UpdateProfile;
