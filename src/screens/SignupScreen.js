import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert
} from 'react-native';
import database from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';

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

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [hostelName, setHostelName] = useState('');
  const [roomNo, setRoomNo] = useState('');

  //
  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
      if (
            email.length > 0 &&
            password.length > 0 && // Ensure password is not empty
            name.length > 0 &&
            rollNo.length > 0 &&
            hostelName !== '' &&
            roomNo.length > 0) {
        // Validate room number
        if (/^\d+$/.test(roomNo) && parseInt(roomNo) >= 100 && parseInt(roomNo) <= 400) {
          const isUserCreated = await auth().createUserWithEmailAndPassword(
            email,
            password,
          );

          console.log(isUserCreated);

          const addUser = async () => {
            firestore().collection('users').doc(isUserCreated.user.uid).set({
              name,
              rollNo,
              hostelName,
              roomNo
            })
            .then(() => {
              console.log("User data added to Firestore successfully!");
            })
            .catch((error) => {
              console.error("Error adding user data to Firestore: ", error);
            });
          };
          addUser();
          navigation.navigate('Login');
        } else {
          // Display an alert if room number is invalid
          Alert.alert('Invalid Room Number', 'Please enter a valid room number between 100 and 400.');
        }
      } else {
         Alert.alert('Required Fields', 'Please fill in all required fields.');
      }
    } catch (err) {
      console.log(err);
      setMessage(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View>
        <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>
          HOCMAN
        </Text>
        <TextInput
                  style={styles.inputBox}
                  placeholder="Enter Your Email"
                  value={email}
                  onChangeText={value => setEmail(value)}
        />
        <TextInput
                  style={styles.inputBox}
                  placeholder="Enter Your Password"
                  value={password}
                  onChangeText={value => setPassword(value)}
                  secureTextEntry={true}
        />
        <TextInput
                  style={styles.inputBox}
                  placeholder="Enter Your name"
                  value={name}
                  onChangeText={value => setName(value)}
        />
        <TextInput
                  style={styles.inputBox}
                  placeholder="Enter Your rollNo"
                  value={rollNo}
                  onChangeText={value => setRollNo(value)}
        />
        <Picker
          selectedValue={hostelName}
          onValueChange={(itemValue) =>
            setHostelName(itemValue)
          }
          >
          <Picker.Item label="Select Hostel" value=""/>
          {hostels.map((hostel, index) => (
                            <Picker.Item key={index} label={hostel.label} value={hostel.value} />
                          ))}
        </Picker>
        <TextInput
                  style={styles.inputBox}
                  placeholder="Enter Your roomNo"
                  value={roomNo}
                  onChangeText={value => setRoomNo(value)}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleSignup()}>
          <Text style={{color: '#fff'}}>Signup</Text>
        </TouchableOpacity>

        <Text>{message}</Text>

        <TouchableOpacity
          style={styles.signup}
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <Text style={{color: 'blue'}}>Already Have An Account ?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const {height, width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    width: width - 30,
    borderRadius: 15,
    borderWidth: 2,
    marginVertical: 10,
    padding: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
  },
  signup: {
    alignItems: 'center',
  },
});
