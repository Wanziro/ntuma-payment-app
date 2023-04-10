import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {Pressable, View, StatusBar, Text, Easing} from 'react-native';

import {INavigationProp} from '../../../interfaces';
import {APP_COLORS} from '../../constants/colors';
import Login from '../../screens/not-logged-in/login';

const Stack = createStackNavigator();

function NotLoggedIn() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={APP_COLORS.MAROON} barStyle="light-content" />
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{
          headerMode: 'float',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Ntuma Agents Login',
            headerStyle: {
              backgroundColor: APP_COLORS.MAROON,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NotLoggedIn;
