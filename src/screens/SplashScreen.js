import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect } from 'react';
import Auth from '@react-native-firebase/auth';
import { StackActions, useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      Auth().onAuthStateChanged(user => {
        const routeName = user !== null ? 'Home' : 'Login';

        navigation.dispatch(StackActions.replace(routeName));
      });
    }, 3000);

    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../images/logo.jpg')}
        style={styles.logo}
      />
      <Text style={styles.title}>HOCMAN</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
});





//import { View, Text, StyleSheet } from 'react-native';
//import React, { useEffect } from 'react';
//import Auth from '@react-native-firebase/auth';
//import { StackActions, useNavigation } from '@react-navigation/native';
//
//export default function SplashScreen() {
//  const navigation = useNavigation();
//
//  useEffect(() => {
//    setTimeout(() => {
//      Auth().onAuthStateChanged(user => {
//        const routeName = user !== null ? 'Home' : 'Login';
//
//        navigation.dispatch(StackActions.replace(routeName));
//      });
//    }, 3000);
//
//    return () => {};
//  }, []);
//
//  return (
//    <View style={styles.container}>
//      <Text style={styles.title}>SplashScreen</Text>
//    </View>
//  );
//}
//
//const styles = StyleSheet.create({
//  container: {
//    flex: 1,
//    justifyContent: 'center',
//    alignItems: 'center',
//    backgroundColor: '#212121', // Dark background color
//  },
//  title: {
//    fontSize: 24,
//    fontWeight: 'bold',
//    color: '#FFFFFF', // Title color
//  },
//});