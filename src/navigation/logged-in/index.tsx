import React, {Profiler, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import {Pressable, View, StatusBar, Text, Easing, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {APP_COLORS} from '../../constants/colors';
import {useLoadBasiData} from '../../helpers';
import PaymentRequests from '../../screens/logged-in/payment-requests';
import {INavigationProp} from '../../../interfaces';
import {saveAppToken} from '../../actions/user';
import Profile from '../../screens/logged-in/profile';
import UpdateUserInfo from '../../screens/logged-in/update-user-info';
import ChangePassword from '../../screens/logged-in/change-password';
const Stack = createStackNavigator();

function LoggedIn() {
  const dispatch = useDispatch();
  const loadData = useLoadBasiData();
  const [initialRoute, setInitialRoute] = useState('');
  useEffect(() => {
    loadData();

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // console.log(
          //   'Notification caused app to open from quit state:',
          //   remoteMessage.notification,
          // );
          if (remoteMessage?.data?.type) {
            setInitialRoute(remoteMessage.data.type); // navigate to this screen
          }
        }
      });
    dispatch(saveAppToken());
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={APP_COLORS.MAROON} barStyle="light-content" />
      <Stack.Navigator
        initialRouteName="HomeTabs"
        screenOptions={{
          // headerMode: 'float',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen
          name="PaymentRequests"
          component={PaymentRequests}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Payment Requests',
            headerStyle: {
              backgroundColor: APP_COLORS.MAROON,
            },
            headerTitleAlign: 'left',
            headerTintColor: APP_COLORS.WHITE,
            headerRight: () => (
              <View style={{marginRight: 15}}>
                <Pressable onPress={() => navigation.navigate('Profile')}>
                  <Icon name="gear" size={25} color={APP_COLORS.WHITE} />
                </Pressable>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
            headerStyle: {backgroundColor: APP_COLORS.MAROON},
          }}
        />
        <Stack.Screen
          name="UpdateUserInfo"
          component={UpdateUserInfo}
          options={({route, navigation}: INavigationProp) => ({
            title: 'Update Personal Information',
            headerStyle: {
              backgroundColor: APP_COLORS.MAROON,
            },
            headerTitleAlign: 'center',
            headerTintColor: APP_COLORS.WHITE,
          })}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={({route, navigation}: INavigationProp) => ({
            title: 'ChangePassword',
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

export default LoggedIn;
