import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Auth from '@react-native-firebase/auth';
import { useNavigation, StackActions } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#009688' }]}
        onPress={() => navigation.navigate('ReviewComplaintAdmin')}>
        <Text style={styles.buttonText}>Review Complaints</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#009688' }]}
        onPress={() => navigation.navigate('UpdateProfileAdmin')}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#960067', width: '30%' }]}
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
