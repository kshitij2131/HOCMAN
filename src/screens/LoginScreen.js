import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, StatusBar, Alert, BackHandler } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        BackHandler.exitApp();
        return true;
      });

      return () => {
        backHandler.remove();
      };
    }, []);

  const adminLogin = async () => {
    try {
      if (email.length > 0 && password.length > 0) {
        const isAdminLogin = await auth().signInWithEmailAndPassword(email, password);
        const adminsRef = firestore().collection('admins');
        const snapshot = await adminsRef.get();
        let isAdmin = false;

        snapshot.forEach(doc => {
          const admin = doc.data();
          if (admin.email === email) {
            isAdmin = true;
            setMessage('');
          }
        });

        if (isAdmin) {
          navigation.dispatch(StackActions.replace('HomeAdmin'));
        } else {
          UserLogin();
        }
      } else {
        Alert.alert('Please Enter All Data');
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };

  const UserLogin = async () => {
    try {
      if (email.length > 0 && password.length > 0) {
        const isUserLogin = await auth().signInWithEmailAndPassword(email, password);
        setMessage('');
        console.log(isUserLogin.user.uid);
        navigation.dispatch(StackActions.replace('Home'));
      } else {
        Alert.alert('Please Enter All Data');
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View>
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' }}>Login</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter Your Email"
          placeholderTextColor="#F5F5F5"
          value={email}
          onChangeText={value => setEmail(value)}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Enter Your Password"
          placeholderTextColor="#F5F5F5"
          value={password}
          onChangeText={value => setPassword(value)}
          secureTextEntry={true}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => adminLogin()}>
          <Text style={{ color: '#FFFFFF' }}>Login</Text>
        </TouchableOpacity>

        <Text style={{ color: '#FFFFFF' }}>{message}</Text>

        <TouchableOpacity
          style={styles.signup}
          onPress={() => { navigation.navigate('Signup'); }}>
          <Text style={{ color: '#009688' }}>New User Signup ?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { height, width } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#212121', // Dark background color
  },
  inputBox: {
    width: width - 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF', // White border color
    marginVertical: 10,
    padding: 10,
    color: '#FFFFFF', // White text color
  },
  addButton: {
    backgroundColor: '#009688', // Button color
    alignItems: 'center',
    padding: 15,
    borderRadius: 25, // Reduced border radius
    marginTop: 10,
  },
  signup: {
    alignItems: 'center',
  },
});
