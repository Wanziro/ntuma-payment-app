/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

import {Provider} from 'react-redux';
import {store, persistor} from './src/store';
import {PersistGate} from 'redux-persist/integration/react';
import PushNotification from 'react-native-push-notification';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

PushNotification.configure({
  onNotification: function (notification) {
    // console.log('NOTIFICATION:', notification);
    // process the notification
    // (required) Called when a remote is received or opened, or local notification is opened
    // notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
});

const AppWithRedux = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => AppWithRedux);
