//sMNPzCmDPtX92IqYDU5RhDrOyH9S42HuSy0VZkW/xBEzsh+jwuj3pUjPe+AsRTM9
//https://devglan.com/online-tools/text-encryption-decryption
import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// imports screens
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import HomeScreenAdmin from '../screens/HomeScreenAdmin';
import SplashScreen from '../screens/SplashScreen';
import AddComplaint from '../screens/AddComplaint';
import ReviewComplaint from '../screens/ReviewComplaint';
import ReviewComplaintAdmin from '../screens/ReviewComplaintAdmin';
import UpdateProfile from '../screens/UpdateProfile';
import FullComplaint from '../screens/FullComplaint';
import UpdateProfileAdmin from '../screens/UpdateProfileAdmin';

const Stack = createNativeStackNavigator();

function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeAdmin"
          component={HomeScreenAdmin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddComplaint"
          component={AddComplaint}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ReviewComplaint"
          component={ReviewComplaint}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ReviewComplaintAdmin"
          component={ReviewComplaintAdmin}
          options={{headerShown: false}}
        />
       <Stack.Screen
         name="FullComplaint"
         component={FullComplaint}
         options={{headerShown: false}}
       />
       <Stack.Screen
         name="UpdateProfile"
         component={UpdateProfile}
         options={{headerShown: false}}
       />
       <Stack.Screen
         name="UpdateProfileAdmin"
         component={UpdateProfileAdmin}
         options={{headerShown: false}}
       />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;