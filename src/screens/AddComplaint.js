
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const types = ['AC', 'Fan', 'Tubelight', 'Furniture', 'Watercooler', 'Geyser', 'Construction', 'Equipments', 'Others'];

const AddComplaintScreen = () => {
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [imageData, setImageData] = useState('');
  const [fullImgRefPath, setFullImgRefPath] = useState('');
  const [imgDownloadUrl, setImgDownloadUrl] = useState('');

  const handlePickImage = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
        copyTo: 'cachesDirectory'
      });
      setImageData(response);
      setImageUri(response.uri);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddComplaint = async () => {
    try {
      // Validate required fields
      if (!type || !location) {
        throw new Error('Type and Location are required fields.');
      }

      const uploadImage = async () => {
        try {
          const response = storage().ref(`/complaintImage/${imageData.name}`);
          const put = await response.putFile(imageData.fileCopyUri);

          setFullImgRefPath(put.metadata.fullPath);
          const url = await response.getDownloadURL();

          setImgDownloadUrl(url);

          console.log(imgDownloadUrl);

          alert('Image Uploaded Successfully');
        } catch (err) {
          console.log(err);
        }
      };

      uploadImage();

      // Add complaint to Firebase database
      const userId = auth().currentUser.uid;
      const currentDate = new Date().toISOString();
      const complaintRef = firestore().collection(`users/${userId}/complaints`).doc();
      await complaintRef.set({
        type,
        location,
        description,
        imgDownloadUrl,
        status: 'pending',
        userId,
        createdAt: currentDate,
      });

      Alert.alert('Success', 'Complaint added successfully.');
      setType('');
      setLocation('');
      setDescription('');
      setImageUri('');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Type *</Text>
      <Picker
        selectedValue={type}
        onValueChange={(value) => setType(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Type" value="" />
        {types.map((type, index) => (
          <Picker.Item key={index} label={type} value={type} />
        ))}
      </Picker>
      <Text style={styles.label}>Location *</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={(value) => setLocation(value)}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        multiline
        value={description}
        onChangeText={(value) => setDescription(value)}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handlePickImage}
      >
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
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
    backgroundColor: '#212121', // Dark background color
    alignItems: 'center',
  },
  label: {
    color: '#FFFFFF', // White text color
    marginBottom: 5,
  },
  picker: {
    width: '100%',
    backgroundColor: '#424242', // Dark gray background color
    color: '#FFFFFF', // White text color
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#FFFFFF', // White text color
    backgroundColor: '#424242', // Dark gray background color
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2196F3', // Blue button color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF', // White text color
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});

export default AddComplaintScreen;


//import React, { useState } from 'react';
//import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
//import { Picker } from '@react-native-picker/picker';
//import DocumentPicker from 'react-native-document-picker';
//import storage from '@react-native-firebase/storage';
//import firestore from '@react-native-firebase/firestore';
//import auth from '@react-native-firebase/auth';
//
//const types = ['AC', 'Fan', 'Tubelight', 'Furniture', 'Watercooler', 'Geyser', 'Construction', 'Equipments', 'Others'];
//
//const AddComplaintScreen = () => {
//  const [type, setType] = useState('');
//  const [location, setLocation] = useState('');
//  const [description, setDescription] = useState('');
//  const [imageUri, setImageUri] = useState('');
//  const [imageData, setImageData]= useState('');
//  const [fullImgRefPath, setFullImgRefPath] = useState('');
//  const [imgDownloadUrl, setImgDownloadUrl] = useState('');
//
//  const handlePickImage = async () => {
//    try {
//      const response = await DocumentPicker.pickSingle({
//        type: [DocumentPicker.types.images],
//        copyTo: 'cachesDirectory'
//      });
//      setImageData(response);
//      setImageUri(response.uri);
//      console.log(response);
//    } catch (err) {
//      console.log(err);
//    }
//  };
//
//  const handleAddComplaint = async () => {
//    try {
//      // Validate required fields
//      if (!type || !location) {
//        throw new Error('Type and Location are required fields.');
//      }
//
//      const uploadImage = async () => {
//          try {
//            const response = storage().ref(`/complaintImage/${imageData.name}`);
////            console.log(response);
//            const put = await response.putFile(imageData.fileCopyUri);
////            console.log(put);
//
//            setFullImgRefPath(put.metadata.fullPath);
//            const url = await response.getDownloadURL();
//
//            setImgDownloadUrl(url);
//
//            console.log(imgDownloadUrl);
//
//            alert('Image Uploaded Successfully');
//          } catch (err) {
//            console.log(err);
//          }
//        };
//
//       uploadImage();
//
//      // Add complaint to Firebase database
//      const userId = auth().currentUser.uid;
//      const currentDate = new Date().toISOString();
//      const complaintRef = firestore().collection(`users/${userId}/complaints`).doc();
//      await complaintRef.set({
//        type,
//        location,
//        description,
//        imgDownloadUrl,
//        status: 'pending',
//        userId,
//        createdAt: currentDate,
//      });
//
//      Alert.alert('Success', 'Complaint added successfully.');
//      setType('');
//      setLocation('');
//      setDescription('');
//      setImageUri('');
//    } catch (error) {
//      Alert.alert('Error', error.message);
//    }
//  };
//
//  return (
//    <View style={styles.container}>
//      <Text>Type *</Text>
//      <Picker
//        selectedValue={type}
//        onValueChange={(value) => setType(value)}
//      >
//        <Picker.Item label="Select Type" value="" />
//        {types.map((type, index) => (
//          <Picker.Item key={index} label={type} value={type} />
//        ))}
//      </Picker>
//      <Text>Location *</Text>
//      <TextInput
//        style={styles.input}
//        value={location}
//        onChangeText={(value) => setLocation(value)}
//      />
//      <Text>Description</Text>
//      <TextInput
//        style={styles.input}
//        multiline
//        value={description}
//        onChangeText={(value) => setDescription(value)}
//      />
//      <TouchableOpacity
//        style={styles.button}
//        onPress={handlePickImage}
//      >
//        <Text style={styles.buttonText}>Select Image</Text>
//      </TouchableOpacity>
//      {imageUri? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
//      <TouchableOpacity
//        style={styles.button}
//        onPress={handleAddComplaint}
//      >
//        <Text style={styles.buttonText}>Add Complaint</Text>
//      </TouchableOpacity>
//    </View>
//  );
//};
//
//const styles = StyleSheet.create({
//  container: {
//    flex: 1,
//    padding: 20,
//  },
//  input: {
//    borderWidth: 1,
//    borderColor: '#ccc',
//    borderRadius: 5,
//    padding: 10,
//    marginBottom: 10,
//  },
//  button: {
//    backgroundColor: 'blue',
//    padding: 10,
//    borderRadius: 5,
//    alignItems: 'center',
//    marginBottom: 10,
//  },
//  buttonText: {
//    color: 'white',
//    fontWeight: 'bold',
//  },
//  image: {
//    width: 200,
//    height: 200,
//    marginBottom: 10,
//  },
//});
//
//export default AddComplaintScreen;
