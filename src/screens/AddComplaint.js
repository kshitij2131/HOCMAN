import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {Picker} from '@react-native-picker/picker';

const types = ['AC', 'Fan', 'Tubelight', 'Furniture', 'Watercooler',
'Geyser', 'Construction', 'Equipments', 'Others'];

const AddComplaintScreen = () => {
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleAddComplaint = async () => {
    try {
      // Validate required fields
      if (!type || !location) {
        throw new Error('Type and Location are required fields.');
      }

      // Upload image if available
//      let imageUrl = '';
//      if (image) {
//        const uploadUri = image;
//        const filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
//        const storageRef = storage().ref(`images/${filename}`);
//        await storageRef.putFile(uploadUri);
//        imageUrl = await storageRef.getDownloadURL();
//      }

      // Add complaint to Firebase database
      const userId = auth().currentUser.uid;
      const currentDate = new Date().toISOString();
      const complaintRef = firestore().collection(`users/${userId}/complaints`).doc();
      await complaintRef.set({
        type,
        location,
        description,
        status: 'pending',
        userId,
        createdAt: currentDate,
      });

      Alert.alert('Success', 'Complaint added successfully.');
      setType('');
      setLocation('');
      setDescription('');
      setImage(null);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Type *</Text>
      <Picker
        selectedValue={type}
        onValueChange={(value) => setType(value)}
      >
        <Picker.Item label="Select Type" value="" />
        {types.map((type, index) => (
          <Picker.Item key={index} label={type} value={type} />
        ))}
      </Picker>
      <Text>Location *</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={(value) => setLocation(value)}
      />
      <Text>Description</Text>
      <TextInput
        style={styles.input}
        multiline
        value={description}
        onChangeText={(value) => setDescription(value)}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleAddComplaint}
      >
        <Text style={styles.buttonText}>Add Complaint</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddComplaintScreen;
