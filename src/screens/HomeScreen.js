import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Auth from '@react-native-firebase/auth';
import { useNavigation, StackActions } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Dashboard</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2196F3' }]}
        onPress={() => navigation.navigate('AddComplaint')}>
        <Text style={styles.buttonText}>Add Complaint</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
        onPress={() => navigation.navigate('ReviewComplaint')}>
        <Text style={styles.buttonText}>Review Complaint</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#FFC107' }]}
        onPress={() => navigation.navigate('UpdateProfile')}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#F44336',width: '30%' }]}
        onPress={async () => {
          await Auth().signOut();
          navigation.dispatch(StackActions.popToTop());
        }}>
        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121', // Dark background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF', // Title color
  },
  button: {
    width: '80%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // Button text color
  },
};


//import React from 'react';
//import { View, Text, TouchableOpacity } from 'react-native';
//import Auth from '@react-native-firebase/auth';
//import { useNavigation, StackActions } from '@react-navigation/native';
//
//export default function HomeScreen() {
//  const navigation = useNavigation();
//
//  return (
//    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
//        Student Dashboard
//      </Text>
//      <TouchableOpacity
//        style={styles.button}
//        onPress={() => navigation.navigate('AddComplaint')}>
//        <Text style={styles.buttonText}>Add Complaint</Text>
//      </TouchableOpacity>
//      <TouchableOpacity
//        style={styles.button}
//        onPress={() => navigation.navigate('ReviewComplaint')}>
//        <Text style={styles.buttonText}>Review Complaint</Text>
//      </TouchableOpacity>
//      <TouchableOpacity
//        style={styles.button}
//        onPress={() => navigation.navigate('UpdateProfile')}>
//        <Text style={styles.buttonText}>Update Profile</Text>
//      </TouchableOpacity>
//      <TouchableOpacity
//        style={styles.logoutButton}
//        onPress={async () => {
//          await Auth().signOut();
//          navigation.dispatch(StackActions.popToTop());
//        }}>
//        <Text style={{ color: '#fff' }}>Logout</Text>
//      </TouchableOpacity>
//    </View>
//  );
//}
//
//const styles = {
//  button: {
//    width: '80%',
//    backgroundColor: '#007bff',
//    alignItems: 'center',
//    padding: 10,
//    borderRadius: 20,
//    marginVertical: 10,
//  },
//  buttonText: {
//    color: '#fff',
//    fontWeight: 'bold',
//  },
//  logoutButton: {
//    width: '80%',
//    backgroundColor: 'red',
//    alignItems: 'center',
//    padding: 10,
//    borderRadius: 20,
//    marginTop: 20,
//  },
//};
